import { IdType, Node } from 'vis';
import { GraphDataService } from '../services/graph-data.service';
import { ColorState } from '../services/graph-painter.service';
import { GraphAlgorithmInput, State } from '../types/algorithm.types';

export function* bfsAlgorithm(input: GraphAlgorithmInput, graphData: GraphDataService): Iterator<State> {
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

    currentState.nodes.set(currentNode.id.toString(), { node: currentNode, color: ColorState.CURRENT });
    yield currentState;

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

    currentState.nodes.set(currentNode.id.toString(), { node: currentNode, color: ColorState.FINISHED });
    for (const singleNeighbourId of neighbourNodes) {
      const singleNeighbour = graphData.graphNodes.get(singleNeighbourId);
      if (singleNeighbour && singleNeighbour.id) {
        currentState.nodes.set(singleNeighbour.id.toString(), { node: singleNeighbour, color: ColorState.EDIT });
      }
    }

    yield currentState;
  }
}
