import { EdgeColorState, NodeColorState } from 'src/app/graphConfig/colorConfig';
import { DataSet, Edge, IdType, Network, Node } from 'vis';
import { AlgorithmGroup, SSSPAlgorithmInput, State } from '../../types/algorithm.types';
import { DijkstraAlgorithm } from '../abstract/dijkstra.algorithm';

export class DijkstraSSSPAlgorithm extends DijkstraAlgorithm {
  constructor() {
    super(AlgorithmGroup.SSSP, { startNode: undefined });
  }

  public override *startAlgorithm(input: SSSPAlgorithmInput, graph: Network): Iterator<State> {
    if (input.startNode?.id == undefined) {
      throw new Error('Wrong input provided!');
    }

    //@ts-ignore
    const nodesDataset = graph.body.data.nodes as DataSet<Node>;
    //@ts-ignore
    const edgesDataSet = graph.body.data.edges as DataSet<Edge>;

    const dijkstraIterator = super.startAlgorithm(input, graph);
    let currentState: { value: State; done?: boolean | undefined };

    do {
      currentState = dijkstraIterator.next();
      if (!currentState.done) {
        yield currentState.value;
      }
    } while (!currentState.done);

    const usedEdgeIds = new Set<IdType>(
      Array.from(this.latestMetaData.allPaths.values())
        .reduce((acc, path) => [...acc, ...path], [])
        .map((edge) => edge.id!)
    );

    yield {
      nodes: new Map(
        nodesDataset.map((node, id) => {
          return [id, { node: node, color: NodeColorState.NONE }];
        })
      ),
      edges: new Map(
        edgesDataSet.map((edge, id) => {
          const isUsedEdge = usedEdgeIds.has(id);

          if (isUsedEdge) {
            return [id, { edge: edge, color: EdgeColorState.SELECTED_PATH as EdgeColorState }];
          }

          return [id, { edge: edge, color: EdgeColorState.NONE }];
        })
      ),
    };
  }
}
