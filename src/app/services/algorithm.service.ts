import { Injectable } from '@angular/core';
import { DataSet, Edge, IdType, Node } from 'vis';
import { GraphDataService } from './graph-data.service';
import { GraphPainterService, NodeColorState } from './graph-painter.service';

//TODO: Extract
export interface State {
  nodes: Map<string, { node: Node; color: NodeColorState }>;
  edges: Map<string, { edge: Node; color: NodeColorState }>;
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
  private finished = false;
  private started = false;

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
    this.started = true;
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
      this.finished = true;
      return;
    }

    //@ts-ignore
    this.stateHistory.push(structuredClone(newState.value));
    this.currentStateIndex++;
    this.graphPainter.paintState(this.stateHistory[this.currentStateIndex]);
  }

  stepBackward() {
    //TODO: <0
    this.currentStateIndex--;
    this.graphPainter.paintState(this.stateHistory[this.currentStateIndex]);
    this.stateHistory.forEach(console.log)
  }

  runAlgorithm() {
    const intervalId = setInterval(() => {
      if (this.finished) {
        window.clearInterval(intervalId);
        return;
      }
      this.stepForward();
    }, 1000);
  }
}
