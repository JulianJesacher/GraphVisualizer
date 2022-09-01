import { Node, IdType, Network, Edge } from 'vis';
import { NodeColorState, EdgeColorState } from '../graphConfig/colorConfig';
import { equalArrays } from '../helper/comparators';

export type TraversalAlgorithmInput = { startNode: Node | undefined };

export type SPSPAlgorithmInput = { startNode: Node | undefined; targetNode: Node | undefined };

export type GraphAlgorithmInput = TraversalAlgorithmInput | SPSPAlgorithmInput;

export const isSPSPAlgorithmInput = (input: GraphAlgorithmInput): input is SPSPAlgorithmInput => {
  return equalArrays(Object.keys(input), ['startNode', 'targetNode']);
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

export abstract class GraphAlgorithm {
  constructor(public group: AlgorithmGroup, public emptyInputData: GraphAlgorithmInput) {}

  abstract startAlgorithm(input: GraphAlgorithmInput, graph: Network): Iterator<State>;
}

export interface State {
  nodes: Map<IdType | string, { node: Node; color: NodeColorState }>;
  edges: Map<IdType | string, { edge: Edge; color: EdgeColorState }>;
}

export enum AutoRunButtonState {
  RUN,
  STOPP,
  REPEAT,
}
