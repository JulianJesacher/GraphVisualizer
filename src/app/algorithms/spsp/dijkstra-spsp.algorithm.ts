import { EdgeColorState } from 'src/app/graphConfig/colorConfig';
import { DataSet, Edge, Network } from 'vis';
import { State, SPSPAlgorithmInput, AlgorithmGroup, EdgeState, isSPSPAlgorithmInput } from '../../types/algorithm.types';
import { DijkstraAlgorithm, DijkstraMetaData } from '../abstract/dijkstra.algorithm';

export class DijkstraSPSPAlgorithm extends DijkstraAlgorithm {
  constructor() {
    super(AlgorithmGroup.SPSP, { startNode: undefined, targetNode: undefined });
  }

  public override *startAlgorithm(input: SPSPAlgorithmInput, graph: Network): Iterator<State> {
    if (input.targetNode?.id == undefined || input.startNode?.id == undefined) {
      throw new Error('Wrong input provided!');
    }

    const dijkstraIterator = super.startAlgorithm(input, graph);
    let currentState: { value: State; done?: boolean | undefined };
    let previousState: State | null = null;

    do {
      currentState = dijkstraIterator.next();
      if (!currentState.done) {
        previousState = currentState.value;
        yield currentState.value;
      }
    } while (!currentState.done);

    if (previousState == null) {
      return;
    }

    //@ts-ignore
    const edgesDataSet = graph.body.data.edges as DataSet<Edge>;

    const pathToTarget = this.latestMetaData.allPaths.get(+input.targetNode.id);
    if (!pathToTarget) {
      return;
    }

    //Trace back step by step from target to start
    for (let i = pathToTarget.length - 1; i >= 0; i--) {
      const currentState: State = {
        nodes: previousState.nodes,
        edges: new Map(
          edgesDataSet.map((edge, id) => {
            const currentStepNode = pathToTarget[i].id == id;
            const inSubPath = pathToTarget.slice(i).some((pathEdge) => pathEdge.id == id);

            if (currentStepNode) {
              return [id, { edge: edge, color: EdgeColorState.CURRENT as EdgeColorState }];
            }

            if (inSubPath) {
              return [id, { edge: edge, color: EdgeColorState.SELECTED_PATH as EdgeColorState }];
            }

            return [id, { edge: edge, color: EdgeColorState.NONE }];
          })
        ),
      };
      yield currentState;
    }

    //Paint the final path
    yield {
      nodes: previousState.nodes,
      edges: new Map(
        edgesDataSet.map((edge, id) => {
          const inPath = pathToTarget.some((pathEdge) => pathEdge.id == id);

          if (inPath) {
            return [id, { edge: edge, color: EdgeColorState.FINAL_PATH as EdgeColorState }];
          }

          return [id, { edge: edge, color: EdgeColorState.NONE }];
        })
      ),
    };
  }
}
