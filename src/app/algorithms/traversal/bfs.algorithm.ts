import { DataSet, IdType, Network, Node } from 'vis';
import { ColorState } from '../../graphConfig/colorConfig';
import { GraphAlgorithmInput, State, GraphAlgorithm, AlgorithmGroup } from '../../types/algorithm.types';

export class BfsAlgorithm extends GraphAlgorithm {
  constructor() {
    super(AlgorithmGroup.TRAVERSAL, { startNode: undefined });
  }

  public *startAlgorithm(input: GraphAlgorithmInput, graph: Network): Iterator<State> {
    if (!input.startNode) {
      throw new Error('Invalid input data, no startNode was provided!');
    }

    //@ts-ignore
    const nodes = graph.body.data.nodes as DataSet<Node>;
    //@ts-ignore
    const edges = graph.body.data.edges as DataSet<Edge>;

    const queue: Node[] = [input.startNode];
    const visited: IdType[] = [];
    const currentState: State = {
      nodes: new Map(nodes.map((node, id) => [id, { node: node, color: ColorState.NONE }])),
      edges: new Map(edges.map((edge, id) => [id, { edge: edge, color: ColorState.NONE }])),
    };

    if (!input.startNode.id) {
      throw new Error('The selected start node has no id!');
    }
    visited.push(input.startNode.id);

    while (queue.length) {
      const currentNode: Node = queue.shift() as Node;
      if (!currentNode?.id) {
        continue;
      }

      //Set color of current node to CURRENT
      currentState.nodes.set(currentNode.id, { node: currentNode, color: ColorState.CURRENT });
      yield currentState;

      //List of nodes which have to be set to "EDIT" after all neighbours were explored.
      const nodesToSetEdit = [];

      //Iterate over neighbours
      const neighbourNodes = graph.getConnectedNodes(currentNode.id, 'to') as IdType[];
      for (const singleNeighbourId of neighbourNodes) {
        currentState.nodes.set(currentNode.id, { node: currentNode, color: ColorState.EDIT });

        //Includes uses strict equality (===) and therefore does not work here
        if (!visited.some((visitedId) => visitedId == singleNeighbourId)) {
          visited.push(singleNeighbourId);

          const singleNeighbour = nodes.get(singleNeighbourId);
          if (singleNeighbour && singleNeighbour.id) {
            currentState.nodes.set(singleNeighbour.id, { node: singleNeighbour, color: ColorState.CURRENT });
            queue.push(singleNeighbour);
            nodesToSetEdit.push(singleNeighbour);
          }

          yield currentState;
        }
      }

      //Set all nodes with CURRENT color to EDIT color (not part of the actual algorithm)
      currentState.nodes.set(currentNode.id, { node: currentNode, color: ColorState.FINISHED });
      for (const singleNode of nodesToSetEdit) {
        if (singleNode && singleNode.id) {
          currentState.nodes.set(singleNode.id, { node: singleNode, color: ColorState.EDIT });
        }
      }

      yield currentState;
    }
  }
}
