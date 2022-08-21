import { Node } from 'vis';
import { GraphDataService } from '../services/graph-data.service';
import { NodeColorState } from '../services/graph-painter.service';

export interface State {
  nodes: Map<string, { node: Node; color: NodeColorState }>;
  edges: Map<string, { edge: Node; color: NodeColorState }>;
}

export type GraphAlgorithmInput = { startNode: Node };

export type GraphAlgorithm = (input: GraphAlgorithmInput, graphData: GraphDataService) => Iterator<State>;
