import { Node, IdType, Network, Edge } from 'vis';
import { NodeColorState, EdgeColorState } from '../config/colorConfig';
import { equalArrays } from '../helper/comparators';

export type TraversalAlgorithmInput = { startNode: Node | undefined };

export type SPSPAlgorithmInput = { startNode: Node | undefined; targetNode: Node | undefined };

export type SSSPAlgorithmInput = TraversalAlgorithmInput;

export type APSPAlgorithmInput = {};

export type GraphAlgorithmInput = TraversalAlgorithmInput | SPSPAlgorithmInput | SSSPAlgorithmInput | APSPAlgorithmInput;

export const isSPSPAlgorithmInput = (input: GraphAlgorithmInput): input is SPSPAlgorithmInput => {
  return equalArrays(Object.keys(input), ['startNode', 'targetNode']);
};

export const isTraversalAlgorithmInput = (input: GraphAlgorithmInput): input is TraversalAlgorithmInput => {
  return equalArrays(Object.keys(input), ['startNode']);
};

export const isSSSPAlgorithmInput = (input: GraphAlgorithmInput): input is SSSPAlgorithmInput => {
  return equalArrays(Object.keys(input), ['startNode']);
};

export type GraphAlgorithmType = (input: GraphAlgorithmInput, graph: Network) => Iterator<State>;

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

export type NodeState = Map<IdType | string, { node: Node; color: NodeColorState }>;
export type EdgeState = Map<IdType | string, { edge: Edge; color: EdgeColorState }>;

export interface State {
  nodes: NodeState;
  edges: EdgeState;
}

export enum AutoRunButtonState {
  RUN,
  STOP,
  REPEAT,
}

export interface AlgorithmExecutionInformation {
  informationType: 'warn' | 'error' | 'none';
  showDialog?: boolean;
  informationDetail?: string;
  informationSummary?: string;
}
