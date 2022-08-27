import { Injectable } from '@angular/core';
import { State } from '../types/algorithm.types';
import { GraphDataService } from './graph-data.service';
import { IdType } from 'vis';
import { ColorState, nodeColorOptions } from '../graphConfig/colorConfig';
import { SelectedNodeInformation } from '../types/algorithm-intializer-dialog.types';

@Injectable({
  providedIn: 'root',
})
export class GraphPainterService {
  constructor(private graphData: GraphDataService) {}

  paintNodeByState(nodeId: IdType | undefined, state: ColorState) {
    if (!nodeId) {
      throw new Error('No id of the node to paint was provided!');
    }
    this.graphData.graphNodes.update({ id: nodeId, color: nodeColorOptions[state] });
  }

  paintState(newState: State) {
    newState.nodes.forEach((singleEntry, id) => this.paintNodeByState(id, singleEntry.color));
  }

  removePaintFromAllNodes() {
    this.graphData.graphNodes.forEach((node, id) => this.paintNodeByState(id, ColorState.NONE)); //todo: optimize
  }

  paintBySelectedNodeInformation(selectedNodeInformation: SelectedNodeInformation[]) {
    this.removePaintFromAllNodes();
    selectedNodeInformation.forEach((nodeInformation) => this.paintNodeByState(nodeInformation.node.id, nodeInformation.color));
  }
}
