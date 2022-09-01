import { DataSet, Edge, EdgeOptions, IdType, Network, Node } from 'vis';
import { NodeColorState, EdgeColorState } from '../../graphConfig/colorConfig';
import { State, GraphAlgorithm, AlgorithmGroup, SPSPAlgorithmInput } from '../../types/algorithm.types';
import { NodePriorityQueue } from '../helper/nodePriorityQueue';
import { dataSetToArray } from '../../helper/datasetOperators';
import { nonStrictIncludes } from '../../helper/comparators';

export class DijkstraSSSPAlgorithm extends GraphAlgorithm {
  constructor() {
    super(AlgorithmGroup.SPSP, { startNode: undefined, targetNode: undefined });
  }

  private _edgesDataSet?: DataSet<Edge>;
  private _edgeArray?: Edge[];

  public *startAlgorithm(input: SPSPAlgorithmInput, graph: Network): Iterator<State> {
    if (!input.startNode || !input.targetNode || !input.startNode.id || !input.targetNode.id) {
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
    const previous: { [key: IdType]: Node | null } = {};
    nodesDataset.forEach((node: Node) => {
      if (node.id) {
        previous[node.id] = null;
        distances[node.id] = Infinity;
      }
    });
    distances[input.startNode.id] = 0;
    previous[input.startNode.id] = input.startNode;

    const currentState: State = {
      nodes: new Map(nodesDataset.map((node, id) => [id, { node: node, color: NodeColorState.NONE }])),
      edges: new Map(edgesDataSet.map((edge, id) => [id, { edge: edge, color: EdgeColorState.NONE }])),
    };

    //Initialize priority queue with the start node as the only element with priority 0, so it will be the first to be removed
    const priorityQueue = new NodePriorityQueue();
    priorityQueue.insert(input.startNode, 0);

    //Helper for the colors
    const nodeIdToNeighbours: { [key: IdType]: number } = {};
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
        const colorState = nonStrictIncludes(previousUpdatedEdges, edge) ? EdgeColorState.SELETED_PATH : EdgeColorState.NONE;
        currentState.edges.set(edge.id, { edge: edge, color: colorState });
      }

      previousEdges = [];
      previousUpdatedEdges = [];

      // Check if the currently considered node leads to a node having visited all neighbours and
      // in that case, set this node as finished
      const backwardNeighbours = graph.getConnectedNodes(currentNode.id, 'from') as IdType[];
      for (const currentNeighbourId of backwardNeighbours) {
        if (currentNeighbourId in nodeIdToNeighbours && nodeIdToNeighbours[currentNeighbourId] == 1) {
          const neighbour = nodesDataset.get(currentNeighbourId);
          if (!neighbour || !neighbour.id) {
            continue;
          }
          currentState.nodes.set(neighbour.id, { node: neighbour, color: NodeColorState.FINISHED });
        } else if (currentNeighbourId in nodeIdToNeighbours) {
          nodeIdToNeighbours[currentNeighbourId] -= 1;
        }
      }

      //Iterate over neighbours
      const neighbourNodes = graph.getConnectedNodes(currentNode.id, 'to') as IdType[];
      nodeIdToNeighbours[currentNode.id] = neighbourNodes.length;
      const consideredEdges: Edge[] = [];

      for (const currentNeighbourId of neighbourNodes) {
        const connectingEdge = edgesArray.find((edge) => edge.from == currentNode.id && edge.to == currentNeighbourId) as Edge;
        if (!connectingEdge || !connectingEdge.label || !connectingEdge.id) {
          continue;
        }
        previousEdges.push(connectingEdge);

        consideredEdges.push(connectingEdge);
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

    yield currentState;
  }

  private _getBacktraceEdgeStates(
    currentNodeId: IdType,
    startNodeId: IdType,
    previousNodes: { [key: IdType]: Node | null },
    colorStateToPaint: EdgeColorState
  ): Map<IdType | string, { edge: EdgeOptions; color: EdgeColorState }> {
    const selectedEdges: IdType[] = [];
    if (!this._edgeArray || !this._edgesDataSet) {
      throw new Error('Edge array or edge Dataset not available, painting the edges not possible!');
    }

    while (currentNodeId != null && currentNodeId != startNodeId) {
      const previousNode = previousNodes[currentNodeId as number];
      if (!previousNode || !previousNode.id) {
        break;
      }

      const connectingEdge = this._edgeArray.find((edge) => edge.from == previousNode.id && edge.to == currentNodeId);
      if (connectingEdge && connectingEdge.id) {
        selectedEdges.push(connectingEdge.id);
      }

      currentNodeId = previousNode.id;
    }

    const edgeState = new Map(
      this._edgesDataSet.map((edge: Edge, id: IdType) => {
        const colorState = nonStrictIncludes(selectedEdges, id) ? colorStateToPaint : EdgeColorState.NONE;
        return [id, { edge: edge, color: colorState }];
      })
    );
    return edgeState;
  }
}
