import { DataSet, Edge, IdType, Node } from 'vis';
import { GraphAlgorithmInput, State, GraphAlgorithm } from '../services/algorithm.service';
import { GraphDataService } from '../services/graph-data.service';
import { NodeColorState } from '../services/graph-painter.service';

export function* bfsAlgorithm(input: GraphAlgorithmInput, graphData: GraphDataService): Iterator<State> {
  const queue: Node[] = [input.startNode];
  const visited: IdType[] = [];
  const currentState: State = {
    nodes: new Map(graphData.graphNodes.map((node, id) => [id.toString(), { node: node, color: NodeColorState.NONE }])),
    edges: new Map(graphData.graphNodes.map((edge, id) => [id.toString(), { edge: edge, color: NodeColorState.NONE }])),
  };

  while (queue.length) {
    const currentNode: Node = queue.shift() as Node;
    if (!currentNode?.id) {
      continue;
    }

    currentState.nodes.set(currentNode.id.toString(), { node: currentNode, color: NodeColorState.CURRENT });
    yield currentState;

    const neighbourNodes = graphData.graph.getConnectedNodes(currentNode.id, 'to') as IdType[];
    for (const singleNeighbourId of neighbourNodes) {
      currentState.nodes.set(currentNode.id.toString(), { node: currentNode, color: NodeColorState.EDIT });
      if (!visited.includes(singleNeighbourId)) {
        visited.push(singleNeighbourId);

        const singleNeighbour = graphData.graphNodes.get(singleNeighbourId);
        if (singleNeighbour && singleNeighbour.id) {
          currentState.nodes.set(singleNeighbour.id.toString(), { node: singleNeighbour, color: NodeColorState.CURRENT });
          queue.push(singleNeighbour);
        }
        yield currentState;
      }
    }

    currentState.nodes.set(currentNode.id.toString(), { node: currentNode, color: NodeColorState.FINISHED });
    for (const singleNeighbourId of neighbourNodes) {
      const singleNeighbour = graphData.graphNodes.get(singleNeighbourId);
      if (singleNeighbour && singleNeighbour.id) {
        currentState.nodes.set(singleNeighbour.id.toString(), { node: singleNeighbour, color: NodeColorState.EDIT });
      }
    }
    yield currentState;
  }
}
