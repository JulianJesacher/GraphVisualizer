import { EdgeColorState } from 'src/app/graphConfig/colorConfig';
import { AlgorithmGroup, EdgeState, GraphAlgorithmInput, State } from 'src/app/types/algorithm.types';
import { DataSet, Edge, IdType, Network, Node } from 'vis';

export abstract class GraphAlgorithm {
  constructor(public group: AlgorithmGroup, public emptyInputData: GraphAlgorithmInput) {}

  abstract startAlgorithm(input: GraphAlgorithmInput, graph: Network): Iterator<State>;

  protected _previousNodesSSSPorSPSP!: { [key: IdType]: Node | null };
  protected _edgesDataSet?: DataSet<Edge>;
  protected _edgeArray?: Edge[];

  protected *_getBacktraceEdgeStatesIterator(
    currentNodeId: IdType,
    startNodeId: IdType,
    colorStateToPaint: EdgeColorState
  ): Iterator<EdgeState> {
    if (!this._edgeArray || !this._edgesDataSet) {
      throw new Error('Edge array or edge Dataset not available, painting the edges not possible!');
    }
    if (!this._previousNodesSSSPorSPSP) {
      throw new Error('No information about the predecessor of the nodes available, backtracing not possible!');
    }

    const edgeState = new Map(this._edgesDataSet.map((edge: Edge, id: IdType) => [id, { edge: edge, color: EdgeColorState.NONE }]));

    while (currentNodeId != null && currentNodeId != startNodeId) {
      const previousNode = this._previousNodesSSSPorSPSP[currentNodeId as number];
      if (!previousNode || (!previousNode.id && previousNode.id != 0)) {
        break;
      }

      const connectingEdge = this._edgeArray.find((edge) => edge.from == previousNode.id && edge.to == currentNodeId);
      if (connectingEdge && connectingEdge.id) {
        edgeState.set(connectingEdge.id, { edge: connectingEdge, color: colorStateToPaint });
        yield edgeState;
      }

      currentNodeId = previousNode.id;
    }
  }

  protected _getBacktraceEdgeStates(currentNodeId: IdType, startNodeId: IdType, colorStateToPaint: EdgeColorState): EdgeState {
    const iterator = this._getBacktraceEdgeStatesIterator(currentNodeId, startNodeId, colorStateToPaint);
    let currentState: { value: EdgeState; done?: boolean | undefined };
    let previousState: EdgeState | undefined = undefined;
    do {
      currentState = iterator.next();
      if (!currentState.done) {
        previousState = currentState.value;
      }
    } while (!currentState.done);
    if (!previousState) {
      throw new Error('Something went wrong, no valid state available');
    }
    return previousState;
  }
}
