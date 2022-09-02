import { Network } from 'vis';
import { AlgorithmGroup, SSSPAlgorithmInput, State } from '../../types/algorithm.types';
import { DijkstraAlgorithm } from '../abstract/dijkstra.algorithm';

export class DijkstraSSSPAlgorithm extends DijkstraAlgorithm {
  constructor() {
    super(AlgorithmGroup.SSSP, { startNode: undefined });
  }

  public override *startAlgorithm(input: SSSPAlgorithmInput, graph: Network): Iterator<State> {
    if (!input.startNode || (!input.startNode.id && input.startNode != 0)) {
      throw new Error('Wrong input provided!');
    }

    const dijkstraIterator = super.startAlgorithm(input, graph);
    let currentState: { value: State; done?: boolean | undefined };
    do {
      currentState = dijkstraIterator.next();
      if (!currentState.done) {
        yield currentState.value;
      }
    } while (!currentState.done);
  }
}
