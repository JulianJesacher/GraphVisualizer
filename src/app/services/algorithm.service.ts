import { Injectable } from '@angular/core';
import { GraphAlgorithm, GraphAlgorithmInput, State } from '../types/algorithm.types';
import { GraphDataService } from './graph-data.service';
import { GraphPainterService } from './graph-painter.service';

enum AlgorithmState {
  RUNNING,
  FINISHED,
  PAUSE,
}

@Injectable({
  providedIn: 'root',
})
export class AlgorithmService {
  private stateHistory: State[] = [];
  private algorithm?: GraphAlgorithm;
  private stateIterator?: Iterator<State>;
  private currentStateHistoryIndex = 0;
  private algorithmState = AlgorithmState.PAUSE;

  constructor(private graphData: GraphDataService, private graphPainter: GraphPainterService) {}

  setAlgorithm(newAlgorithm: GraphAlgorithm) {
    this.clear();
    this.algorithm = newAlgorithm;
  }

  start(inputData: GraphAlgorithmInput) {
    if (!this.algorithm) {
      throw new Error('No algorithm selected!');
    }
    this.stateIterator = this.algorithm(inputData, this.graphData);
    this.algorithmState = AlgorithmState.RUNNING;
  }

  clear() {
    this.stateHistory = [];
    this.currentStateHistoryIndex = 0;
  }

  stepForward() {
    if (!this.stateIterator) {
      throw new Error('No stateIterator available!');
    }

    // If the currently presented state is not the newest, no new state has to be calculated,
    // so only the next state from the history is shown
    if (this.currentStateHistoryIndex < this.stateHistory.length) {
      this.graphPainter.paintState(this.stateHistory[this.currentStateHistoryIndex]);
      this.currentStateHistoryIndex++;
      return;
    }

    const newState = this.stateIterator.next();
    if (newState.done) {
      //TODO: do something
      console.log('finished');
      this.algorithmState = AlgorithmState.FINISHED;
      return;
    }

    //@ts-ignore
    this.stateHistory.push(structuredClone(newState.value));
    this.graphPainter.paintState(this.stateHistory[this.currentStateHistoryIndex]);
    this.currentStateHistoryIndex++;
  }

  stepBackward() {
    if(this.currentStateHistoryIndex<=0){
      throw new Error("Can't go back further, already the initial state!")
    }

    this.currentStateHistoryIndex--;
    this.graphPainter.paintState(this.stateHistory[this.currentStateHistoryIndex]);
  }

  runAlgorithm(intervalTime: number = 1000) {
    const intervalId = setInterval(() => {
      if (this.algorithmState === AlgorithmState.FINISHED) {
        clearInterval(intervalId);
        return;
      }
      this.stepForward();
    }, intervalTime);
  }
}
