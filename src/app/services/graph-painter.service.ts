import { Injectable } from '@angular/core';
import { GraphDataService } from './graph-data.service';

@Injectable({
  providedIn: 'root',
})
export class GraphPainterService {
  constructor(private graphData: GraphDataService) {}

  private nodeColorOptions = {
    edit: {
      background: '#D46E26',
    },
    current: {
      background: '#D61111',
    },
    finished: {
      background: '#0E42C7',
    },
    none: {
      background: '#FFFFFF'
    }
  };

  paintNodeByState(nodeId: number, state: NodeColorState) {
    this.graphData.getNodes.update({ id: nodeId, color:  this.nodeColorOptions[state]});
  }
}

export enum NodeColorState {
  NONE = 'none',
  CURRENT = 'current',
  FINISHED = 'finished',
  EDIT = 'edit',
}
