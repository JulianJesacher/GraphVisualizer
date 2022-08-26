import { EdgeOptions, Node } from 'vis';
import { GraphDataService } from '../services/graph-data.service';
import { ColorState } from '../services/graph-painter.service';

export type GraphAlgorithmInput = { startNode: Node };

export type GraphAlgorithmType = (input: GraphAlgorithmInput, graphData: GraphDataService) => Iterator<State>;

export enum AlgorithmGroup {
  TRAVERSAL,
  APSP,
  SPSP,
  SSSP,
}

export abstract class GraphAlgorithm {
  constructor(public type: AlgorithmGroup) {}

  abstract startAlgorithm: GraphAlgorithmType;
}

export interface State {
  nodes: Map<string, { node: Node; color: ColorState }>;
  edges: Map<string, { edge: EdgeOptions; color: ColorState }>;
}

export enum AutoRunButtonState {
  RUN,
  STOPP,
  REPEAT,
}
