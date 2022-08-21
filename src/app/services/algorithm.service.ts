import { Injectable } from '@angular/core';
import { GraphAlgorithm, GraphAlgorithmInput, State } from '../types/algorithm.types';
import { GraphDataService } from './graph-data.service';
import { GraphPainterService } from './graph-painter.service';

@Injectable({
  providedIn: 'root',
})
export class AlgorithmService {
  private stateHistory: State[] = [];
  private algorithm?: GraphAlgorithm;
  private iterator?: Iterator<State>;
  private currentStateIndex = 0;
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
    this.currentStateIndex = 0;
  }

  stepForward() {
    if (!this.iterator) {
      return;
    }

    if(this.currentStateIndex<this.stateHistory.length){
      this.graphPainter.paintState(this.stateHistory[this.currentStateIndex]);
      this.currentStateIndex++;
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
    this.graphPainter.paintState(this.stateHistory[this.currentStateIndex]);
    this.currentStateIndex++;
  }

  stepBackward() {
    //TODO: <0
    this.currentStateIndex--;
    this.graphPainter.paintState(this.stateHistory[this.currentStateIndex]);
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
