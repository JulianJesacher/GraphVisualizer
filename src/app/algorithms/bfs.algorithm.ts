import { IdType, Node } from 'vis';
import { ColorState } from '../graphConfig/colorConfig';
import { GraphDataService } from '../services/graph-data.service';
import { GraphAlgorithmInput, State, GraphAlgorithm, AlgorithmGroup } from '../types/algorithm.types';

export class BfsAlgorithm extends GraphAlgorithm {
  constructor() {
    super(AlgorithmGroup.TRAVERSAL);
  }

  public startAlgorithm = function* (input: GraphAlgorithmInput, graphData: GraphDataService): Iterator<State> {
    const queue: Node[] = [input.startNode];
    const visited: IdType[] = [];
    const currentState: State = {
      nodes: new Map(graphData.graphNodes.map((node, id) => [id.toString(), { node: node, color: ColorState.NONE }])),
      edges: new Map(graphData.graphEdges.map((edge, id) => [id.toString(), { edge: edge, color: ColorState.NONE }])),
    };

    while (queue.length) {
      const currentNode: Node = queue.shift() as Node;
      if (!currentNode?.id) {
        continue;
      }

      //Set color of current node to CURRENT
      currentState.nodes.set(currentNode.id.toString(), { node: currentNode, color: ColorState.CURRENT });
      yield currentState;

      //Iterate over neighbours
      const neighbourNodes = graphData.graph.getConnectedNodes(currentNode.id, 'to') as IdType[];
      for (const singleNeighbourId of neighbourNodes) {
        currentState.nodes.set(currentNode.id.toString(), { node: currentNode, color: ColorState.EDIT });

        if (!visited.includes(singleNeighbourId)) {
          visited.push(singleNeighbourId);

          const singleNeighbour = graphData.graphNodes.get(singleNeighbourId);
          if (singleNeighbour && singleNeighbour.id) {
            currentState.nodes.set(singleNeighbour.id.toString(), { node: singleNeighbour, color: ColorState.CURRENT });
            queue.push(singleNeighbour);
          }

          yield currentState;
        }
      }

      //Set all nodes with CURRENT color to EDIT color
      currentState.nodes.set(currentNode.id.toString(), { node: currentNode, color: ColorState.FINISHED });
      for (const singleNeighbourId of neighbourNodes) {
        const singleNeighbour = graphData.graphNodes.get(singleNeighbourId);

        if (singleNeighbour && singleNeighbour.id) {
          currentState.nodes.set(singleNeighbour.id.toString(), { node: singleNeighbour, color: ColorState.EDIT });
        }
      }

      yield currentState;
    }
  };
}
