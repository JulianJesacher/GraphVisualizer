import { MessageService } from 'primeng/api';
import { AlgorithmExecutionInformation, AlgorithmGroup, GraphAlgorithmInput, State } from 'src/app/types/algorithm.types';
import { Network } from 'vis';

export abstract class GraphAlgorithm {
  constructor(public group: AlgorithmGroup, public emptyInputData: GraphAlgorithmInput) {}

  abstract startAlgorithm(input: GraphAlgorithmInput, graph: Network): Iterator<State>;

  public verify(graph: Network): AlgorithmExecutionInformation {
    return {
      informationType: 'none',
    };
  }
}
