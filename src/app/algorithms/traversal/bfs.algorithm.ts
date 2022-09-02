import { DataSet, IdType, Network, Node } from 'vis';
import { NodeColorState, EdgeColorState } from '../../graphConfig/colorConfig';
import { GraphAlgorithmInput, State, AlgorithmGroup, TraversalAlgorithmInput } from '../../types/algorithm.types';
import { GraphAlgorithm } from '../abstract/base.algorithm';

export class BfsTraversalAlgorithm extends GraphAlgorithm {
  constructor() {
    super(AlgorithmGroup.TRAVERSAL, { startNode: undefined });
  }

  public *startAlgorithm(input: TraversalAlgorithmInput, graph: Network): Iterator<State> {
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
      nodes: new Map(nodes.map((node, id) => [id, { node: node, color: NodeColorState.NONE }])),
      edges: new Map(edges.map((edge, id) => [id, { edge: edge, color: EdgeColorState.NONE }])),
    };

    if (!input.startNode.id && input.startNode.id!=0) {
      throw new Error('The selected start node has no id!');
    }
    visited.push(input.startNode.id);

    while (queue.length) {
      const currentNode: Node = queue.shift() as Node;
      if (!currentNode?.id) {
        continue;
      }

      //Set color of current node to CURRENT
      currentState.nodes.set(currentNode.id, { node: currentNode, color: NodeColorState.CURRENT });
      yield currentState;

      //Iterate over neighbours
      const neighbourNodes = graph.getConnectedNodes(currentNode.id, 'to') as IdType[];
      for (const singleNeighbourId of neighbourNodes) {
        //Includes uses strict equality (===) and therefore does not work here
        if (!visited.some((visitedId) => visitedId == singleNeighbourId)) {
          visited.push(singleNeighbourId);

          const singleNeighbour = nodes.get(singleNeighbourId);
          if (singleNeighbour && singleNeighbour.id) {
            currentState.nodes.set(singleNeighbour.id, { node: singleNeighbour, color: NodeColorState.EDIT });
            queue.push(singleNeighbour);
          }

          yield currentState;
        }
      }

      currentState.nodes.set(currentNode.id, { node: currentNode, color: NodeColorState.FINISHED });
      yield currentState;

      //Push unexplored node to the queue to traverse the whole algorithm
      if (!queue.length) {
        let newNode: Node | undefined = undefined;
        nodes.forEach((node) => {
          //-1 as default becuase such an id does not exist
          //Includes uses strict equality (===) and therefore does not work here
          if (!visited.some((visitedId) => visitedId == node.id)) {
            newNode = node;
          }
        });

        if (newNode && newNode['id']) {
          queue.push(newNode);
          visited.push(newNode['id']);
        }
      }
    }
  }
}
