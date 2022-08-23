import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GraphAlgorithm, GraphAlgorithmInput, State } from '../types/algorithm.types';
import { GraphDataService } from './graph-data.service';
import { GraphPainterService } from './graph-painter.service';

export enum AlgorithmState {
  NOT_SELECTED,
  RUNNING,
  FINISHED,
  PAUSE,
  INITIAL_STATE,
}

@Injectable({
  providedIn: 'root',
})
export class AlgorithmService {
  private stateHistory: State[] = [];
  private algorithm?: GraphAlgorithm;
  private stateIterator?: Iterator<State>;
  private currentStateHistoryIndex = 0;
  public algorithmState$ = new BehaviorSubject<AlgorithmState>(AlgorithmState.NOT_SELECTED);

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
    this.algorithmState$.next(AlgorithmState.INITIAL_STATE);
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
      this.algorithmState$.next(AlgorithmState.FINISHED);
      return;
    }

    //@ts-ignore
    this.stateHistory.push(structuredClone(newState.value));
    this.graphPainter.paintState(this.stateHistory[this.currentStateHistoryIndex]);
    this.currentStateHistoryIndex++;
  }

  stepBackward() {
    if (this.algorithmState$.value === AlgorithmState.INITIAL_STATE) {
      throw new Error("Can't go back further, already the initial state!");
    }

    this.currentStateHistoryIndex--;
    this.graphPainter.paintState(this.stateHistory[this.currentStateHistoryIndex]);

    if (this.currentStateHistoryIndex === 0) {
      this.algorithmState$.next(AlgorithmState.INITIAL_STATE);
    }
  }

  runAlgorithm(intervalTime: number = 1000) {
    this.algorithmState$.next(AlgorithmState.RUNNING);

    const intervalId = setInterval(() => {
      if (this.algorithmState$.value === AlgorithmState.FINISHED) {
        clearInterval(intervalId);
        return;
      }
      this.stepForward();
    }, intervalTime);
  }
}
