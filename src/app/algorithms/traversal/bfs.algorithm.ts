import { DataSet, Edge, IdType, Network, Node } from 'vis';
import { EdgeColorState, NodeColorState } from '../../graphConfig/colorConfig';
import { State, AlgorithmGroup, TraversalAlgorithmInput } from '../../types/algorithm.types';
import { GraphAlgorithm } from '../abstract/base.algorithm';
import { default as clonedeep } from 'lodash.clonedeep';
import { dataSetToArray } from 'src/app/helper/datasetOperators';

interface BFSTraversalMetaData {
  currentEdge: Edge | undefined;
  currentNode: Node;
  queue: Node[];
}

export class BfsTraversalAlgorithm extends GraphAlgorithm {
  constructor() {
    super(AlgorithmGroup.TRAVERSAL, { startNode: undefined });
  }

  private *bfsRunner(input: TraversalAlgorithmInput, graph: Network): Generator<BFSTraversalMetaData> {
    if (input.startNode?.id == undefined) {
      throw new Error('Invalid input data!');
    }

    //@ts-ignore
    const nodes = graph.body.data.nodes as DataSet<Node>;
    //@ts-ignore
    const edges = graph.body.data.edges as DataSet<Edge>;
    const edgesArray = dataSetToArray(edges);

    const queue: Node[] = [input.startNode];
    const visited: IdType[] = [];

    visited.push(input.startNode.id);

    while (queue.length) {
      const currentNode: Node = queue.shift() as Node;
      if (!currentNode?.id) {
        continue;
      }

      yield {
        currentNode: clonedeep(currentNode),
        currentEdge: undefined,
        queue: clonedeep(queue),
      };

      //Iterate over neighbours
      const neighbourNodes = graph.getConnectedNodes(currentNode.id, 'to') as IdType[];
      for (const singleNeighbourId of neighbourNodes) {
        //Includes uses strict equality (===) and therefore does not work here
        if (!visited.some((visitedId) => visitedId == singleNeighbourId)) {
          visited.push(singleNeighbourId);

          const singleNeighbour = nodes.get(singleNeighbourId);
          if (singleNeighbour == undefined) {
            continue;
          }
          const connectingEdge = edgesArray.find((edge) => edge.from == currentNode.id && edge.to == singleNeighbourId);

          if (singleNeighbour && singleNeighbour.id) {
            queue.push(singleNeighbour);
          }

          yield {
            currentNode: clonedeep(currentNode),
            currentEdge: clonedeep(connectingEdge),
            queue: clonedeep(queue),
          };
        }
      }

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

  public *startAlgorithm(input: TraversalAlgorithmInput, graph: Network): Iterator<State> {
    if (input.startNode?.id == undefined) {
      throw new Error('Invalid input data!');
    }

    //@ts-ignore
    const nodesDataSet = graph.body.data.nodes as DataSet<Node>;
    //@ts-ignore
    const edgesDataSet = graph.body.data.edges as DataSet<Edge>;

    const finishedNodes: IdType[] = [];
    let previousNode: Node | undefined = undefined;
    for (const step of this.bfsRunner(input, graph)) {
      const currentState: State = {
        nodes: new Map(
          nodesDataSet.map((node, id) => {
            const isCurrentNode = id == step.currentNode.id;
            const isQueuedNode = step.queue.some((queuedNode) => queuedNode.id == id);
            const finishedNow = previousNode == undefined ? false : previousNode?.id == id && previousNode?.id != step.currentNode.id;

            if (finishedNow) {
              finishedNodes.push(id);
            }

            if (isCurrentNode) {
              return [id, { node: node, color: NodeColorState.CURRENT as NodeColorState }];
            }

            if (isQueuedNode) {
              return [id, { node: node, color: NodeColorState.EDIT }];
            }

            if (finishedNodes.includes(id)) {
              return [id, { node: node, color: NodeColorState.FINISHED }];
            }

            return [id, { node: node, color: NodeColorState.NONE }];
          })
        ),
        edges: new Map(
          edgesDataSet.map((edge, id) => {
            if (id == step.currentEdge?.id) {
              return [id, { edge: edge, color: EdgeColorState.CURRENT as EdgeColorState }];
            }
            return [id, { edge: edge, color: EdgeColorState.NONE }];
          })
        ),
      };
      previousNode = step.currentNode;
      yield currentState;
    }

    yield {
      nodes: new Map(nodesDataSet.map((node, id) => [id, { node: node, color: NodeColorState.FINISHED }])),
      edges: new Map(edgesDataSet.map((edge, id) => [id, { edge: edge, color: EdgeColorState.NONE }])),
    };
  }
}
