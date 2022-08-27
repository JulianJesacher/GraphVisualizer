import { ColorState } from '../services/graph-painter.service';
import { AlgorithmInputNodeType } from './algorithm.types';

export interface InitializationInformation {
  nodeName: string;
  nodeDescription: string;
  color: ColorState;
  nodeType: AlgorithmInputNodeType;
}

export const inputNodesInitializationInformation = {
  traversal: [
    {
      nodeName: 'Start node',
      nodeDescription: 'Select the start node for the algorithm',
      color: ColorState.START,
      nodeType: AlgorithmInputNodeType.START_NODE,
    },
  ],
  //TODO: Adapt accordingly
  apsp: [
    {
      nodeName: 'Start node',
      nodeDescription: 'Select the start node for the algorithm',
      color: ColorState.START,
      nodeType: AlgorithmInputNodeType.START_NODE,
    },
  ],
  //TODO: Adapt accordingly
  spsp: [
    {
      nodeName: 'Start node',
      nodeDescription: 'Select the start node for the algorithm',
      color: ColorState.START,
      nodeType: AlgorithmInputNodeType.START_NODE,
    },
  ],
  //TODO: Adapt accordingly
  sssp: [
    {
      nodeName: 'Start node',
      nodeDescription: 'Select the start node for the algorithm',
      color: ColorState.START,
      nodeType: AlgorithmInputNodeType.START_NODE,
    },
  ],
};

export interface NodeSelection {
  nodeType: AlgorithmInputNodeType;
  color: ColorState;
}

export type UpdateCurrentNodeSelectionEvent = NodeSelection;
