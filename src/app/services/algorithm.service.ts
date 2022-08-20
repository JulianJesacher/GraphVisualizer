import { Injectable } from '@angular/core';
import { DataSet, Edge, Node } from 'vis';
import { GraphDataService } from './graph-data.service';
import { GraphPainterService, NodeColorState } from './graph-painter.service';

//TODO: Extract
export interface State {
  nodes: DataSet<{ node: Node; color: NodeColorState }>;
  edges: DataSet<{ edge: Edge; color: NodeColorState }>;
}

export type GraphAlgorithmInput = { startNode: Node };

export type GraphAlgorithm = (input: GraphAlgorithmInput, graphData: GraphDataService) => Iterator<State>;

@Injectable({
  providedIn: 'root',
})
export class AlgorithmService {
  private stateHistory: State[] = [];
  private algorithm?: GraphAlgorithm;
  private iterator?: Iterator<State>;
  private currentStateIndex = -1;

  constructor(private graphData: GraphDataService, private graphPainter: GraphPainterService) {}

  setAlgorithm(newAlgorithm: GraphAlgorithm) {
    this.clear();
    this.algorithm = newAlgorithm;
  }

  start(inputData: GraphAlgorithmInput) {
    if (!this.algorithm) {
      return;
    }
    this.iterator = this.algorithm(inputData, this.graphData);
  }

  clear() {
    this.stateHistory = [];
    this.currentStateIndex = -1;
  }

  stepForward() {
    if (!this.iterator) {
      return;
    }

    const newState = this.iterator.next();
    if (newState.done) {
      //TODO: do something
      console.log('finished');
    }
    this.stateHistory.push(newState.value);
    this.currentStateIndex++;

    this.graphPainter.paintNewState(this.stateHistory[this.currentStateIndex]);
  }

  stepBackward() {
    //TODO: <0
    this.currentStateIndex--;
    this.graphPainter.paintNewState(this.stateHistory[this.currentStateIndex]);
  }
}
