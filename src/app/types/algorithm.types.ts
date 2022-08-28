import { EdgeOptions, Node, IdType } from 'vis';
import { ColorState } from '../graphConfig/colorConfig';
import { GraphDataService } from '../services/graph-data.service';

export type TraversalAlgorithmInput = { startNode: Node | undefined };

export type SPSPAlgorithmInput = { startNode: Node | undefined; targetNode: Node | undefined };

export type GraphAlgorithmInput = TraversalAlgorithmInput | SPSPAlgorithmInput;

export type GraphAlgorithmType = (input: TraversalAlgorithmInput | SPSPAlgorithmInput, graphData: GraphDataService) => Iterator<State>;

export enum AlgorithmGroup {
  TRAVERSAL = 'traversal',
  APSP = 'apsp',
  SPSP = 'spsp',
  SSSP = 'sssp',
}

export enum AlgorithmInputNodeType {
  START_NODE = 'startNode',
  TARGET_NODE = 'targetNode',
}

export abstract class GraphAlgorithm {
  constructor(public group: AlgorithmGroup, public emptyInputData: GraphAlgorithmInput) {}

  abstract startAlgorithm: GraphAlgorithmType;
}

export interface State {
  nodes: Map<IdType | string, { node: Node; color: ColorState }>;
  edges: Map<IdType | string, { edge: EdgeOptions; color: ColorState }>;
}

export enum AutoRunButtonState {
  RUN,
  STOPP,
  REPEAT,
}
