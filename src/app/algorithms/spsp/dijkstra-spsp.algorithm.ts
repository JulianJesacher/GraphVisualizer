import { EdgeColorState } from 'src/app/graphConfig/colorConfig';
import { Network } from 'vis';
import { State, SPSPAlgorithmInput, AlgorithmGroup, EdgeState } from '../../types/algorithm.types';
import { DijkstraAlgorithm } from '../abstract/dijkstra.algorithm';

export class DijkstraSPSPAlgorithm extends DijkstraAlgorithm {
  constructor() {
    super(AlgorithmGroup.SPSP, { startNode: undefined, targetNode: undefined });
  }

  public override *startAlgorithm(input: SPSPAlgorithmInput, graph: Network): Iterator<State> {
    if (
      !input.startNode ||
      !input.targetNode ||
      (!input.targetNode.id && input.targetNode.id != 0) ||
      (!input.startNode.id && input.startNode.id != 0)
    ) {
      throw new Error('Wrong input provided!');
    }

    const dijkstraIterator = super.startAlgorithm(input, graph);
    let currentState: { value: State; done?: boolean | undefined };
    let previousState: State | undefined = undefined;
    do {
      currentState = dijkstraIterator.next();
      if (!currentState.done) {
        previousState = currentState.value;
        yield currentState.value;
      }
    } while (!currentState.done);

    if (!previousState) {
      return;
    }

    //Step by step paint the final edges with selected_path color
    const traceBackIterator = super._getBacktraceEdgeStatesIterator(input.targetNode.id, input.startNode.id, EdgeColorState.SELECTED_PATH);
    let currentEdgeState: { value: EdgeState; done?: boolean | undefined };
    do {
      currentEdgeState = traceBackIterator.next();
      if (!currentEdgeState.done) {
        previousState.edges = currentEdgeState.value;
        yield previousState;
      }
    } while (!currentEdgeState.done);

    if (!previousState || !previousState.edges) {
      return;
    }

    //Show the complete final path with final_path color
    const finalPath = super._getBacktraceEdgeStates(input.targetNode.id, input.startNode.id, EdgeColorState.FINAL_PATH);
    previousState.edges = finalPath;
    yield previousState;
  }
}
