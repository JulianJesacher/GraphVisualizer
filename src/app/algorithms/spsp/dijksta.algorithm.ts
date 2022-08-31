import { DataSet, Edge, IdType, Network, Node } from 'vis';
import { ColorState } from '../../graphConfig/colorConfig';
import { State, GraphAlgorithm, AlgorithmGroup, SPSPAlgorithmInput } from '../../types/algorithm.types';
import { NodePriorityQueue } from '../helper/nodePriorityQueue';
import { dataSetToArray } from '../../helper/datasetOperators';
import { nonStrictIncludes } from '../../helper/comparators';

export class DijkstraSPSPAlgorithm extends GraphAlgorithm {
  constructor() {
    super(AlgorithmGroup.SPSP, { startNode: undefined, targetNode: undefined });
  }

  public *startAlgorithm(input: SPSPAlgorithmInput, graph: Network): Iterator<State> {
    if (!input.startNode || !input.targetNode || !input.startNode.id || !input.targetNode.id) {
      throw new Error('Wrong input provided!');
    }

    //@ts-ignore
    const nodesDataset = graph.body.data.nodes as DataSet<Node>;
    //@ts-ignore
    const edgesDataSet = graph.body.data.edges as DataSet<Edge>;
    const edgesArray = dataSetToArray(edgesDataSet);

    //Initialize all datatypes to execute the algorithm
    const distances: { [key: IdType]: number } = {};
    const previous: { [key: IdType]: Node | null } = {};
    nodesDataset.forEach((node: Node) => {
      if (node.id) {
        previous[node.id] = null;
        distances[node.id] = Infinity;
      }
    });
    distances[input.startNode.id] = 0;

    const currentState: State = {
      nodes: new Map(nodesDataset.map((node, id) => [id, { node: node, color: ColorState.NONE }])),
      edges: new Map(edgesDataSet.map((edge, id) => [id, { edge: edge, color: ColorState.NONE }])),
    };

    //Initialize priority queue with the start node as the only element with priority 0, so it will be the first to be removed
    const priorityQueue = new NodePriorityQueue();
    priorityQueue.insert(input.startNode, 0);

    //Helpers for the colors
    const visitedNodes: IdType[] = [];
    const nodeIdToNeighbours: { [key: IdType]: IdType[] } = {};

    let previousNode: Node | null = null;
    while (!priorityQueue.isEmpty()) {
      const currentNode = priorityQueue.deleteMin();
      if (!currentNode?.id) {
        continue;
      }

      visitedNodes.push(currentNode.id);

      //Set color of current node to CURRENT and color of previous node to EDIT
      currentState.nodes.set(currentNode.id, { node: currentNode, color: ColorState.CURRENT });
      if (previousNode && previousNode['id']) {
        currentState.nodes.set(previousNode['id'], { node: previousNode, color: ColorState.EDIT });
      }

      // Check if the currently considered node leads to a node having visited all neighbours and
      // in that case, set this node as finished
      const backwardNeighbours = graph.getConnectedNodes(currentNode.id, 'from') as IdType[];
      for (const currentNeighbourId of backwardNeighbours) {
        if (
          currentNeighbourId in nodeIdToNeighbours &&
          nodeIdToNeighbours[currentNeighbourId].every((neighbour) => nonStrictIncludes(visitedNodes, neighbour))
        ) {
          const neighbour = nodesDataset.get(currentNeighbourId);
          if (!neighbour || !neighbour.id) {
            continue;
          }
          currentState.nodes.set(neighbour.id, { node: neighbour, color: ColorState.FINISHED });
        }
      }

      yield currentState;

      //Iterate over neighbours
      const neighbourNodes = graph.getConnectedNodes(currentNode.id, 'to') as IdType[];
      nodeIdToNeighbours[currentNode.id] = neighbourNodes;
      for (const currentNeighbourId of neighbourNodes) {
        const connectingEdge = edgesArray.find((edge) => edge.from == currentNode.id && edge.to == currentNeighbourId) as Edge;
        if (!connectingEdge || !connectingEdge.label || !connectingEdge.id) {
          continue;
        }

        const currentDistance = distances[currentNeighbourId];
        const newDistance = distances[currentNode.id] + parseInt(connectingEdge.label, 10);

        //If distance over the current node to the neighbour is shorten than currently, update distance and predecessor
        if (newDistance < currentDistance) {
          //Add neighbour to priority queue if it was not inserted before, otherwise decrease the key to the new distance
          const currentNeighbour = nodesDataset.get(currentNeighbourId);
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

          //currentState.edges.set(connectingEdge.id, { edge: connectingEdge, color: ColorState.START });
        }
      }

      previousNode = currentNode;
    }

    if (previousNode && previousNode['id']) {
      currentState.nodes.set(previousNode['id'], { node: previousNode, color: ColorState.FINISHED });
    }
    yield currentState;
  }
}
