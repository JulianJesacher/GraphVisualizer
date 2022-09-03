import { DataSet, Edge, IdType, Network, Node } from 'vis';
import { NodeColorState, EdgeColorState } from '../../graphConfig/colorConfig';
import { State, AlgorithmGroup, GraphAlgorithmInput, SSSPAlgorithmInput, SPSPAlgorithmInput } from '../../types/algorithm.types';
import { NodePriorityQueue } from '../helper/nodePriorityQueue';
import { dataSetToArray } from '../../helper/datasetOperators';
import { GraphAlgorithm } from './base.algorithm';
import { default as clonedeep } from 'lodash.clonedeep';

interface DijkstraMetaData {
  currentNode: Node;
  currentPath: Edge[];
  currentQueue: NodePriorityQueue;
  previousNode: Node | null;
}

export abstract class DijkstraAlgorithm extends GraphAlgorithm {
  constructor(type: AlgorithmGroup, defaultInput: GraphAlgorithmInput) {
    super(type, defaultInput);
  }

  currentlyKnownShortestPaths = new Map<IdType, Edge[]>();

  protected *dijkstraRunner(input: SSSPAlgorithmInput | SPSPAlgorithmInput, graph: Network): Generator<DijkstraMetaData> {
    if (!input.startNode || (!input.startNode.id && input.startNode != 0)) {
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
    this._previousNodesSSSPorSPSP = {};
    nodesDataset.forEach((node: Node) => {
      if (node.id && node.id != 0) {
        this._previousNodesSSSPorSPSP[node.id] = null;
        distances[node.id] = Infinity;
      }
    });
    distances[input.startNode.id ?? 0] = 0;
    this._previousNodesSSSPorSPSP[input.startNode.id ?? 0] = input.startNode;

    //Initialize priority queue with the start node as the only element with priority 0, so it will be the first to be removed
    const priorityQueue = new NodePriorityQueue();
    priorityQueue.insert(input.startNode, 0);

    let previousNode: Node | null = null;

    while (!priorityQueue.isEmpty()) {
      const currentNode = priorityQueue.deleteMin();
      if (!currentNode?.id) {
        continue;
      }

      //Iterate over neighbors
      const neighborNodes = graph.getConnectedNodes(currentNode.id, 'to') as IdType[];

      for (const currentNeighborId of neighborNodes) {
        const connectingEdge = edgesArray.find((edge) => edge.from == currentNode.id && edge.to == currentNeighborId) as Edge;

        // For type safety
        if (!connectingEdge || !connectingEdge.label || !connectingEdge.id) {
          continue;
        }

        const currentDistance = distances[currentNeighborId];
        const newDistance = distances[currentNode.id] + parseInt(connectingEdge.label, 10);

        const previousPath = this.currentlyKnownShortestPaths.get(+currentNode.id) ?? [];
        const currentPath = [...previousPath, connectingEdge];

        //If distance over the current node to the neighbor is shorten than currently, update distance and predecessor
        if (newDistance < currentDistance) {
          this.currentlyKnownShortestPaths.set(+currentNeighborId, currentPath);

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

          this._previousNodesSSSPorSPSP[currentNeighborId] = currentNode;
          distances[currentNeighborId] = newDistance;
        }

        yield {
          currentNode: clonedeep(currentNode),
          currentPath: clonedeep(currentPath),
          currentQueue: clonedeep(priorityQueue),
          previousNode: clonedeep(previousNode),
        };
      }

      previousNode = currentNode;
    }
  }

  public *startAlgorithm(input: SSSPAlgorithmInput | SPSPAlgorithmInput, graph: Network): Iterator<State> {
    if (!input.startNode || (!input.startNode.id && input.startNode != 0)) {
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
    for (const step of this.dijkstraRunner(input, graph)) {
      const currentState: State = {
        nodes: new Map(
          nodesDataset.map((node, id) => {
            const previousPath = [...step.currentPath];
            const lastEdge = previousPath.pop();

            const isLastNode = lastEdge?.to == id;
            const previousNodes = new Set([...previousPath.map((x) => x.from), ...previousPath.map((x) => x.to), lastEdge?.from]);
            const isPreviousNode = previousNodes.has(id);

            if (isLastNode) {
              return [id, { node: node, color: NodeColorState.CURRENT as NodeColorState }];
            }

            if (isPreviousNode) {
              return [id, { node: node, color: NodeColorState.EDIT }];
            }

            return [id, { node: node, color: NodeColorState.NONE }];
          })
        ),
        edges: new Map(
          edgesDataSet.map((edge, id) => {
            const previousPath = [...step.currentPath];
            const lastEdge = previousPath.pop();

            const isLastEdge = lastEdge?.id == edge.id;
            const isPreviousEdge = !!previousPath.find((x) => x.id == edge.id);

            if (isLastEdge) {
              return [id, { edge: edge, color: EdgeColorState.CURRENT as EdgeColorState }];
            }

            if (isPreviousEdge) {
              return [id, { edge: edge, color: EdgeColorState.SELECTED_PATH as EdgeColorState }];
            }

            return [id, { edge: edge, color: EdgeColorState.NONE }];
          })
        ),
      };
      yield currentState;
    }

    const usedEdges = new Set<IdType>(
      Array.from(this.currentlyKnownShortestPaths.values())
        .reduce((acc, path) => [...acc, ...path], [])
        .map((edge) => edge.id!)
    );

    yield {
      nodes: new Map(
        nodesDataset.map((node, id) => {
          return [id, { node: node, color: NodeColorState.NONE }];
        })
      ),
      edges: new Map(
        edgesDataSet.map((edge, id) => {
          const isUsedEdge = usedEdges.has(id);

          if (isUsedEdge) {
            return [id, { edge: edge, color: EdgeColorState.SELECTED_PATH as EdgeColorState }];
          }

          return [id, { edge: edge, color: EdgeColorState.NONE }];
        })
      ),
    };
  }
}
