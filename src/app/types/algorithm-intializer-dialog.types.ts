import { Node } from 'vis';
import { ColorState } from '../graphConfig/colorConfig';
import { AlgorithmInputNodeType } from './algorithm.types';

export interface InitializationInformation {
  nodeName: string;
  taskDescription: string;
  color: ColorState;
  nodeType: AlgorithmInputNodeType;
}

export const inputNodesInitializationInformation = {
  traversal: [
    {
      nodeName: 'Start node',
      taskDescription: 'Please select the start node for the algorithm',
      color: ColorState.START,
      nodeType: AlgorithmInputNodeType.START_NODE,
    },
  ],
  //TODO: Adapt accordingly
  apsp: [
    {
      nodeName: 'Start node',
      taskDescription: 'Please select the start node for the algorithm',
      color: ColorState.START,
      nodeType: AlgorithmInputNodeType.START_NODE,
    },
  ],
  //TODO: Adapt accordingly
  spsp: [
    {
      nodeName: 'Start node',
      taskDescription: 'Please select the start node for the algorithm',
      color: ColorState.START,
      nodeType: AlgorithmInputNodeType.START_NODE,
    },
    {
      nodeName: 'Target node',
      taskDescription: 'Please select the target node for which the shortest path is calculated',
      color: ColorState.TARGET,
      nodeType: AlgorithmInputNodeType.TARGET_NODE,
    },
  ],
  //TODO: Adapt accordingly
  sssp: [
    {
      nodeName: 'Start node',
      taskDescription: 'Please select the start node for the algorithm',
      color: ColorState.START,
      nodeType: AlgorithmInputNodeType.START_NODE,
    },
  ],
};

export interface NodeSelection {
  nodeType: AlgorithmInputNodeType;
  color: ColorState;
  nodeStepIndex: number;
}

export type UpdateCurrentNodeSelectionEvent = NodeSelection;

export interface SelectedNodeInformation extends NodeSelection {
  node: Node;
}
