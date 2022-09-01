import { DataSet, Edge, IdType, Network, Node } from 'vis';
import { NodeColorState, EdgeColorState } from '../../graphConfig/colorConfig';
import { State, AlgorithmGroup, GraphAlgorithmInput, EdgeState } from '../../types/algorithm.types';
import { NodePriorityQueue } from '../helper/nodePriorityQueue';
import { dataSetToArray } from '../../helper/datasetOperators';
import { nonStrictIncludes } from '../../helper/comparators';
import { GraphAlgorithm } from './base.algorithm';

export abstract class DijkstraAlgorithm extends GraphAlgorithm {
  constructor(type: AlgorithmGroup, defaultInput: GraphAlgorithmInput) {
    super(type, defaultInput);
  }

  public *startAlgorithm(input: GraphAlgorithmInput, graph: Network): Iterator<State> {
    if (!input.startNode || !input.startNode.id) {
      throw new Error('Wrong input provided!');
    }

    //Extract nodes and edges from graph
    //@ts-ignore
    const nodesDataset = graph.body.data.nodes as DataSet<Node>;
    //@ts-ignore
    const edgesDataSet = graph.body.data.edges as DataSet<Edge>;
    const edgesArray: Edge[] = dataSetToArray(edgesDataSet);

    this._edgesDataSet = edgesDataSet;
    this._edgeArray = edgesArray;

    //Initialize all datatypes to execute the algorithm
    const distances: { [key: IdType]: number } = {};
    this._previousNodes = {};
    nodesDataset.forEach((node: Node) => {
      if (node.id) {
        this._previousNodes[node.id] = null;
        distances[node.id] = Infinity;
      }
    });
    distances[input.startNode.id] = 0;
    this._previousNodes[input.startNode.id] = input.startNode;

    const currentState: State = {
      nodes: new Map(nodesDataset.map((node, id) => [id, { node: node, color: NodeColorState.NONE }])),
      edges: new Map(edgesDataSet.map((edge, id) => [id, { edge: edge, color: EdgeColorState.NONE }])),
    };

    //Initialize priority queue with the start node as the only element with priority 0, so it will be the first to be removed
    const priorityQueue = new NodePriorityQueue();
    priorityQueue.insert(input.startNode, 0);

    //Helper for the colors
    const nodeIdToNeighbors: { [key: IdType]: number } = {};
    let previousEdges: Edge[] = [];
    let previousUpdatedEdges: Edge[] = [];

    let previousNode: Node | null = null;
    while (!priorityQueue.isEmpty()) {
      const currentNode = priorityQueue.deleteMin();
      if (!currentNode?.id) {
        continue;
      }

      //Set color of current node to CURRENT and color of previous node to EDIT
      currentState.nodes.set(currentNode.id, { node: currentNode, color: NodeColorState.CURRENT });
      if (previousNode && previousNode['id']) {
        currentState.nodes.set(previousNode['id'], { node: previousNode, color: NodeColorState.EDIT });
      }

      //Set color of all previously considered edges to none or to selected, if the distance was updated
      for (const edge of previousEdges) {
        if (!edge.id) {
          continue;
        }
        const colorState = nonStrictIncludes(previousUpdatedEdges, edge) ? EdgeColorState.SELECTED_PATH : EdgeColorState.NONE;
        currentState.edges.set(edge.id, { edge: edge, color: colorState });
      }

      previousEdges = [];
      previousUpdatedEdges = [];

      // Check if the currently considered node leads to a node having visited all neighbors and
      // in that case, set this node as finished
      const backwardNeighbors = graph.getConnectedNodes(currentNode.id, 'from') as IdType[];
      for (const currentNeighborId of backwardNeighbors) {
        if (currentNeighborId in nodeIdToNeighbors && nodeIdToNeighbors[currentNeighborId] == 1) {
          const neighbor = nodesDataset.get(currentNeighborId);
          if (!neighbor || !neighbor.id) {
            continue;
          }
          currentState.nodes.set(neighbor.id, { node: neighbor, color: NodeColorState.FINISHED });
        } else if (currentNeighborId in nodeIdToNeighbors) {
          nodeIdToNeighbors[currentNeighborId] -= 1;
        }
      }

      //Iterate over neighbors
      const neighborNodes = graph.getConnectedNodes(currentNode.id, 'to') as IdType[];
      nodeIdToNeighbors[currentNode.id] = neighborNodes.length;
      const consideredEdges: Edge[] = [];

      for (const currentNeighborId of neighborNodes) {
        const connectingEdge = edgesArray.find((edge) => edge.from == currentNode.id && edge.to == currentNeighborId) as Edge;
        if (!connectingEdge || !connectingEdge.label || !connectingEdge.id) {
          continue;
        }
        previousEdges.push(connectingEdge);

        consideredEdges.push(connectingEdge);
        const currentDistance = distances[currentNeighborId];
        const newDistance = distances[currentNode.id] + parseInt(connectingEdge.label, 10);

        //If distance over the current node to the neighbor is shorten than currently, update distance and predecessor
        if (newDistance < currentDistance) {
          //Add neighbor to priority queue if it was not inserted before, otherwise decrease the key to the new distance
          const currentNeighbor = nodesDataset.get(currentNeighborId);
          if (!currentNeighbor) {
            continue;
          }

          if (distances[currentNeighborId] === Infinity) {
            priorityQueue.insert(currentNeighbor, newDistance);
          } else {
            priorityQueue.decreaseKey(currentNeighbor, newDistance);
          }

          this._previousNodes[currentNeighborId] = currentNode;
          distances[currentNeighborId] = newDistance;
          previousUpdatedEdges.push(connectingEdge);
        }
      }

      previousNode = currentNode;

      //Set color of all considered Edges to current
      for (const edge of consideredEdges) {
        if (!edge.id) {
          continue;
        }
        currentState.edges.set(edge.id, { edge: edge, color: EdgeColorState.CURRENT });
      }
      yield currentState;
    }

    const finishedNodesState = new Map(nodesDataset.map((node, id) => [id, { node: node, color: NodeColorState.FINISHED }]));
    currentState.nodes = finishedNodesState;

    //Set color of all previously considered edges to none or to selected, if the distance was updated
    for (const edge of previousEdges) {
      if (!edge.id) {
        continue;
      }
      const colorState = nonStrictIncludes(previousUpdatedEdges, edge) ? EdgeColorState.SELECTED_PATH : EdgeColorState.NONE;
      currentState.edges.set(edge.id, { edge: edge, color: colorState });
    }

    yield currentState;
  }
}
