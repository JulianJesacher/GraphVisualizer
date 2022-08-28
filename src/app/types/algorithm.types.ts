import { EdgeOptions, Node, IdType } from 'vis';
import { ColorState } from '../graphConfig/colorConfig';
import { GraphDataService } from '../services/graph-data.service';

export type TraversalAlgorithmInput = { startNode: Node };

export type SPSPAlgorithmInput = { startNode: Node; targetNode: Node };

export type GraphAlgorithmInput = TraversalAlgorithmInput | SPSPAlgorithmInput;

export type GraphAlgorithmType = (input: TraversalAlgorithmInput | SPSPAlgorithmInput, graphData: GraphDataService) => Iterator<State>;

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
  nodes: Map<IdType | string, { node: Node; color: ColorState }>;
  edges: Map<IdType | string, { edge: EdgeOptions; color: ColorState }>;
}

export enum AutoRunButtonState {
  RUN,
  STOPP,
  REPEAT,
}

export interface NodeWithPriority extends Node {
  priority: number;
}
