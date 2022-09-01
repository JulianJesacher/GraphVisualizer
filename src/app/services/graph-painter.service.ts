import { Injectable } from '@angular/core';
import { State } from '../types/algorithm.types';
import { GraphDataService } from './graph-data.service';
import { IdType } from 'vis';
import { NodeColorState, nodeColorOptions, EdgeColorState, edgeColorOptions } from '../graphConfig/colorConfig';
import { SelectedNodeInformation } from '../types/algorithm-intializer-dialog.types';

@Injectable({
  providedIn: 'root',
})
export class GraphPainterService {
  constructor(private graphData: GraphDataService) {}

  paintNodeByState(nodeId: IdType | undefined, state: NodeColorState) {
    if (!nodeId) {
      throw new Error('No id of the node to paint was provided!');
    }
    this.graphData.graphNodes.update({ id: nodeId, color: nodeColorOptions[state] });
  }

  paintState(newState: State) {
    newState.nodes.forEach((singleEntry, id) => this.paintNodeByState(id, singleEntry.color));
    newState.edges.forEach((singleEntry, id) => this.paintEdgeByStte(id, singleEntry.color));
  }

  clearPaint() {
    this.graphData.graphNodes.forEach((node, id) => this.paintNodeByState(id, NodeColorState.NONE)); //todo: optimize
    this.graphData.graphEdges.forEach((edge, id) => this.paintEdgeByStte(id, EdgeColorState.NONE)); //todo: optimize
  }

  paintBySelectedNodeInformation(selectedNodeInformation: SelectedNodeInformation[]) {
    this.clearPaint();
    selectedNodeInformation.forEach((nodeInformation) => this.paintNodeByState(nodeInformation.node.id, nodeInformation.color));
  }

  paintEdgeByStte(edgeId: IdType, state: EdgeColorState) {
    if (!edgeId) {
      throw new Error('No id of the node to paint was provided!');
    }
    this.graphData.graphEdges.update({ id: edgeId, color: edgeColorOptions[state] });
  }
}
