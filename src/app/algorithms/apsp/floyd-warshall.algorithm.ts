import { EdgeColorState, NodeColorState } from 'src/app/graphConfig/colorConfig';
import { dataSetToArray } from 'src/app/helper/datasetOperators';
import { AlgorithmGroup, GraphAlgorithmInput, State } from 'src/app/types/algorithm.types';
import { DataSet, Edge, Network, Node } from 'vis';
import { GraphAlgorithm } from '../abstract/base.algorithm';

export class FloydWarshallAPSPAlgorithm extends GraphAlgorithm {
  constructor() {
    super(AlgorithmGroup.APSP, {});
  }

  public *startAlgorithm(input: GraphAlgorithmInput, graph: Network): Iterator<State> {
    //Extract nodes and edges from graph
    //@ts-ignore
    const nodesDataset = graph.body.data.nodes as DataSet<Node>;
    //@ts-ignore
    const edgesDataSet = graph.body.data.edges as DataSet<Edge>;
    const edgesArray: Edge[] = dataSetToArray(edgesDataSet);
    const nodesArray: Node[] = dataSetToArray(nodesDataset);

    const currentState: State = {
      nodes: new Map(nodesDataset.map((node, id) => [id, { node: node, color: NodeColorState.NONE }])),
      edges: new Map(edgesDataSet.map((edge, id) => [id, { edge: edge, color: EdgeColorState.NONE }])),
    };

    //Initialize distances with Infinity and predecessors with null. distances[i][j] is distance form i to j
    const distances: number[][] = new Array(nodesArray.length).fill(Infinity).map(() => new Array(nodesArray.length).fill(Infinity));
    const predecessor: Node[][] = new Array(nodesArray.length).fill(null).map(() => new Array(nodesArray.length).fill(null));

    //Handle paths of length 1
    for (const edge of edgesArray) {
      if (!edge || edge.from == undefined || edge.to == undefined || !edge.label) {
        continue;
      }
      const from = edge.from;
      const to = edge.to;
      const distance = parseInt(edge.label, 10);
      distances[from as number][to as number] = distance;

      const fromNode = nodesDataset.get(from);
      if (!fromNode) {
        continue;
      }
      predecessor[from as number][to as number] = fromNode;
    }

    //Handle paths of length 0
    for (const node of nodesArray) {
      if (!node || (!node.id && node.id != 0)) {
        continue;
      }

      distances[node.id as number][node.id as number] = 0;
      predecessor[node.id as number][node.id as number] = node;
    }

    for (const node of nodesArray) {
      if (!node.id && node.id != 0) {
        continue;
      }
      currentState.nodes.set(node.id, { node: node, color: NodeColorState.CURRENT });

      for (const edge of edgesArray) {
        if (!edge.id && edge.id != 0) {
          continue;
        }

        const from = edge.from;
        const to = edge.to;
        if ((!from && from != 0) || (!to && to != 0) || !edge.label) {
          continue;
        }

        const currentDistance = parseInt(edge.label, 10);
        const newDistance = distances[from as number][node.id as number] + distances[node.id as number][to as number];
        if (currentDistance > newDistance) {
          distances[from as number][to as number] = newDistance;
          predecessor[from as number][to as number] = node;
        }
      }

      yield currentState;
    }
  }
}
