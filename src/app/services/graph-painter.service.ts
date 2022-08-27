import { Injectable } from '@angular/core';
import { State } from '../types/algorithm.types';
import { GraphDataService } from './graph-data.service';
import { IdType } from 'vis';

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
    start: {
      background: '#EBC034',
    },
  };

  paintNodeByState(nodeId: IdType | undefined, state: ColorState) {
    if (!nodeId) {
      throw new Error('No id of the node to paint was provided!');
    }
    this.graphData.graphNodes.update({ id: nodeId, color: this.nodeColorOptions[state] });
  }

  paintState(newState: State) {
    newState.nodes.forEach((singleEntry, id) => this.paintNodeByState(id, singleEntry.color));
  }

  removePaintFromAllNodes() {
    this.graphData.graphNodes.forEach((node, id) => this.paintNodeByState(id, ColorState.NONE)); //todo: optimize
  }
}

export enum ColorState {
  NONE = 'none',
  CURRENT = 'current',
  FINISHED = 'finished',
  EDIT = 'edit',
  START = 'start',
}
