import { IdType, Node } from 'vis';
import { ColorState } from '../../graphConfig/colorConfig';
import { GraphDataService } from '../../services/graph-data.service';
import { State, GraphAlgorithm, AlgorithmGroup, SPSPAlgorithmInput } from '../../types/algorithm.types';
import { NodePriorityQueue } from '../helper/nodePriorityQueue';

export class DijkstraAlgorithm extends GraphAlgorithm {
  constructor() {
    super(AlgorithmGroup.SPSP, { startNode: undefined, targetNode: undefined });
  }

  //@ts-ignore
  public startAlgorithm = function* (input: SPSPAlgorithmInput, graphData: GraphDataService): Iterator<State> {
    if (!input.startNode || !input.targetNode || !input.startNode.id || !input.targetNode.id) {
      throw new Error('Wrong input provided!');
    }

    //Initialize all datatypes to execute the algorithm
    const distances: { [key: IdType]: number } = {};
    const previous: { [key: IdType]: Node | null } = {};
    graphData.graphNodes.forEach((node) => {
      if (!node.id) {
        return;
      }
      previous[node.id] = null;
      distances[node.id] = Infinity;
    });
    distances[input.startNode.id] = 0;

    const currentState: State = {
      nodes: new Map(graphData.graphNodes.map((node, id) => [id, { node: node, color: ColorState.NONE }])),
      edges: new Map(graphData.graphEdges.map((edge, id) => [id, { edge: edge, color: ColorState.NONE }])),
    };

    //Initialize priority queue with the start node as the only element with priority 0, so it will be the first to be removed
    const priorityQueue = new NodePriorityQueue();

    let previousNode: Node | null = null;
    while (!priorityQueue.isEmpty()) {
      const currentNode = priorityQueue.deleteMin();
      if (!currentNode?.id) {
        continue;
      }

      //Set color of current node to CURRENT and color of previous node to EDIT
      currentState.nodes.set(currentNode.id, { node: currentNode, color: ColorState.CURRENT });
      if (previousNode && previousNode['id']) {
        currentState.nodes.set(previousNode['id'], { node: currentNode, color: ColorState.EDIT });
      }
      yield currentState;

      //Iterate over neighbours
      const neighbourNodes = graphData.graph.getConnectedNodes(currentNode.id, 'to') as IdType[];
      for (const currentNeighbourId of neighbourNodes) {
        const currentDistance = distances[currentNeighbourId];
        const newDistance = distances[currentNode.id] + currentDistance;

        //If distance over the current node to the neighbour is shorten than currently, update distance and predecessor
        if (newDistance < currentDistance) {
          //Add neighbour to priority queue if it was not inserted before, otherwise decrease the key to the new distance
          const currentNeighbour = graphData.graphNodes.get(currentNeighbourId);
          if (!currentNeighbour) {
            continue;
          }

          if (distances[currentNeighbourId] === Infinity) {
            priorityQueue.insert(currentNeighbour, newDistance);
          } else {
            priorityQueue.decreaseKey(currentNeighbour, newDistance);
          }

          previous[currentNeighbourId] = currentNode;
          distances[currentNeighbourId] = newDistance;
        }
      }

      previousNode = currentNode;
    }
  };
}
