import { Injectable } from '@angular/core';
import { State } from './algorithm.service';
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
      background: '#FFFFFF',
    },
  };

  paintNodeByState(nodeId: number | string, state: NodeColorState) {
    this.graphData.getNodes.update({ id: nodeId, color: this.nodeColorOptions[state] });
  }

  paintNewState(newState: State) {
    newState.nodes.forEach((singleEntry) => {
      const id = singleEntry.node.id;
      if (id) {
        this.paintNodeByState(id, singleEntry.color);
      }
    });
  }
}

export enum NodeColorState {
  NONE = 'none',
  CURRENT = 'current',
  FINISHED = 'finished',
  EDIT = 'edit',
}
