import { EdgeOptions, Node } from 'vis';
import { ColorState } from '../graphConfig/colorConfig';
import { GraphDataService } from '../services/graph-data.service';

export type TraversalAlgorithmInput = { startNode: Node };

export type GraphAlgorithmInput = TraversalAlgorithmInput;

export type GraphAlgorithmType = (input: GraphAlgorithmInput, graphData: GraphDataService) => Iterator<State>;

export enum AlgorithmGroup {
  TRAVERSAL = 'traversal',
  APSP = 'apsp',
  SPSP = 'spsp',
  SSSP = 'sssp',
}

export enum AlgorithmInputNodeType {
  START_NODE,
  TARGET_NODE,
}

export abstract class GraphAlgorithm {
  constructor(public group: AlgorithmGroup) {}

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
