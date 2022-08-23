import { EdgeOptions, Node } from 'vis';
import { GraphDataService } from '../services/graph-data.service';
import { ColorState } from '../services/graph-painter.service';

export interface State {
  nodes: Map<string, { node: Node; color: ColorState }>;
  edges: Map<string, { edge: EdgeOptions; color: ColorState }>;
}

export type GraphAlgorithmInput = { startNode: Node };

export type GraphAlgorithm = (input: GraphAlgorithmInput, graphData: GraphDataService) => Iterator<State>;
