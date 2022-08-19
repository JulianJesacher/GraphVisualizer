import { DataSet, Edge, IdType, Node } from 'vis';
import { GraphAlgorithmInput, State, GraphAlgorithm } from '../services/algorithm.service';
import { GraphDataService } from '../services/graph-data.service';
import { NodeColorState } from '../services/graph-painter.service';

export function* bfsAlgorithm(input: GraphAlgorithmInput, graphData: GraphDataService): Iterator<State> {
  const queue: Node[] = [input.startNode];
  const visited: IdType[] = [];
  const currentState: State = {
    nodes: new DataSet<{ node: Node; color: NodeColorState }>(graphData.getNodes.map((singleNode) => {return { node: singleNode, color: NodeColorState.NONE };})),
    edges: new DataSet<{ edge: Edge; color: NodeColorState }>(graphData.getEdges.map((singleEdge) => {return { edge: singleEdge, color: NodeColorState.NONE };})),
  };

  while (queue.length) {
    const currentNode: Node = queue.shift() as Node;
    if (!currentNode?.id) {
      continue;
    }

    const neighbourNodes = graphData.graph.getConnectedNodes(currentNode.id, 'to') as IdType[];
    for (const singleNeighbourId of neighbourNodes) {
      if (!visited.includes(singleNeighbourId)) {
        visited.push(singleNeighbourId);

        const singleNeighbour = graphData.getNodes.get(singleNeighbourId);
        if (singleNeighbour) {
          currentState.nodes.update({ node: singleNeighbour, color: NodeColorState.EDIT });
          queue.push(singleNeighbour);
        }
        yield currentState;
      }
    }
  }
}
