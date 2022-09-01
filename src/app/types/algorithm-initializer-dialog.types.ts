import { Node } from 'vis';
import { NodeColorState } from '../graphConfig/colorConfig';
import { AlgorithmInputNodeType } from './algorithm.types';

export interface InitializationInformation {
  nodeName: string;
  taskDescription: string;
  color: NodeColorState;
  nodeType: AlgorithmInputNodeType;
}

export const inputNodesInitializationInformation = {
  traversal: [
    {
      nodeName: 'Start node',
      taskDescription: 'Please select the start node for the algorithm',
      color: NodeColorState.START,
      nodeType: AlgorithmInputNodeType.START_NODE,
    },
  ],
  //TODO: Adapt accordingly
  apsp: [
    {
      nodeName: 'Start node',
      taskDescription: 'Please select the start node for the algorithm',
      color: NodeColorState.START,
      nodeType: AlgorithmInputNodeType.START_NODE,
    },
  ],
  //TODO: Adapt accordingly
  spsp: [
    {
      nodeName: 'Start node',
      taskDescription: 'Please select the start node for the algorithm',
      color: NodeColorState.START,
      nodeType: AlgorithmInputNodeType.START_NODE,
    },
    {
      nodeName: 'Target node',
      taskDescription: 'Please select the target node for which the shortest path is calculated',
      color: NodeColorState.TARGET,
      nodeType: AlgorithmInputNodeType.TARGET_NODE,
    },
  ],
  //TODO: Adapt accordingly
  sssp: [
    {
      nodeName: 'Start node',
      taskDescription: 'Please select the start node for the algorithm',
      color: NodeColorState.START,
      nodeType: AlgorithmInputNodeType.START_NODE,
    },
  ],
};

export interface NodeSelection {
  nodeType: AlgorithmInputNodeType;
  color: NodeColorState;
  nodeStepIndex: number;
}

export type UpdateCurrentNodeSelectionEvent = NodeSelection;

export interface SelectedNodeInformation extends NodeSelection {
  node: Node;
}
