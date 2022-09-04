import { EdgeColorState } from 'src/app/graphConfig/colorConfig';
import { AlgorithmGroup, EdgeState, GraphAlgorithmInput, State } from 'src/app/types/algorithm.types';
import { DataSet, Edge, IdType, Network, Node } from 'vis';

export abstract class GraphAlgorithm {
  constructor(public group: AlgorithmGroup, public emptyInputData: GraphAlgorithmInput) {}

  abstract startAlgorithm(input: GraphAlgorithmInput, graph: Network): Iterator<State>;
}
