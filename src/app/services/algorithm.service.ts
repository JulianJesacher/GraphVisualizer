import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PeekingIterator } from '../helper/peekingIterator';
import { AutoRunButtonState, GraphAlgorithm, GraphAlgorithmInput, State } from '../types/algorithm.types';
import { GraphDataService } from './graph-data.service';
import { GraphPainterService } from './graph-painter.service';

@Injectable({
  providedIn: 'root',
})
export class AlgorithmService {
  private _stateHistory: State[] = [];
  private _currentStateHistoryIndex = -1;
  private _autoStepAlgorithm = false;

  private _algorithm?: GraphAlgorithm;
  private _stateIterator?: PeekingIterator<State>;
  private _iteratorFinished = false;
  private _inputData?: GraphAlgorithmInput;

  public backwardButtonDisabled$ = new BehaviorSubject<boolean>(true);
  public forwardButtonDisabled$ = new BehaviorSubject<boolean>(true);
  public autoRunButtoonState$ = new BehaviorSubject<AutoRunButtonState>(AutoRunButtonState.RUN);

  constructor(private graphData: GraphDataService, private graphPainter: GraphPainterService) {}

  setAlgorithm(newAlgorithm: GraphAlgorithm) {
    this.clear();
    this._algorithm = newAlgorithm;
  }

  initializeAlgorithmWithInputValue(inputData: GraphAlgorithmInput) {
    if (!this._algorithm) {
      throw new Error('No algorithm selected!');
    }

    this._inputData = inputData;
    this._stateIterator = new PeekingIterator(this._algorithm(inputData, this.graphData));
    this._currentStateHistoryIndex = -1;

    this.backwardButtonDisabled$.next(true);
    this.forwardButtonDisabled$.next(false);
    this.autoRunButtoonState$.next(AutoRunButtonState.RUN);
    this.graphPainter.removePaintFromAllNodes();
  }

  clear() {
    this._stateHistory = [];
    this._currentStateHistoryIndex = -1;

    this.backwardButtonDisabled$.next(true);
    this.forwardButtonDisabled$.next(true);
    this.autoRunButtoonState$.next(AutoRunButtonState.RUN);
  }

  stepForward() {
    if (!this._stateIterator) {
      throw new Error('No stateIterator available!');
    }

    this._currentStateHistoryIndex++;

    const newStateRequired = this._currentStateHistoryIndex >= this._stateHistory.length;
    //If the currently presented state is the newest, a new one has to be calculated
    //otherwise it is sufficient to increase the index and paint the next state
    if (newStateRequired) {
      const newState = this._stateIterator?.next();
      if (!newState) {
        throw new Error('The next state is not available');
      }

      //@ts-ignore
      this._stateHistory.push(structuredClone(newState.value));
    }
    this.graphPainter.paintState(this._stateHistory[this._currentStateHistoryIndex]);
    this.backwardButtonDisabled$.next(false);

    if (!this._stateIterator.hasNext()) {
      this._iteratorFinished = true;
    }

    const lastStateReached = this._iteratorFinished && this._currentStateHistoryIndex === this._stateHistory.length - 1;
    if (lastStateReached) {
      this.autoRunButtoonState$.next(AutoRunButtonState.REPEAT);
      this.forwardButtonDisabled$.next(true);
    }
  }

  stepBackward() {
    if (this._currentStateHistoryIndex === -1) {
      throw new Error("Can't go back further, already the initial state!");
    }

    if (this._currentStateHistoryIndex === 0) {
      this.backwardButtonDisabled$.next(true);
      this.graphPainter.removePaintFromAllNodes();
      this._currentStateHistoryIndex--;
      return;
    }

    this._currentStateHistoryIndex--;
    this.graphPainter.paintState(this._stateHistory[this._currentStateHistoryIndex]);
    this.forwardButtonDisabled$.next(false);
  }

  stopAutoStepAlgorithm() {
    this._autoStepAlgorithm = false;
    this.autoRunButtoonState$.next(AutoRunButtonState.RUN);
  }

  runAutoStepAlgorithm(intervalTime: number = 500) {
    this._autoStepAlgorithm = true;
    this.autoRunButtoonState$.next(AutoRunButtonState.STOPP);

    const intervalId = setInterval(() => {
      const lastStateReached = this._iteratorFinished && this._currentStateHistoryIndex === this._stateHistory.length - 1;
      const autoStepActive = this._autoStepAlgorithm;
      if (lastStateReached || !autoStepActive) {
        clearInterval(intervalId);
        return;
      }

      this.stepForward();
    }, intervalTime);
  }

  repeatAlgorithm() {
    if (!this._inputData) {
      throw Error('No input data for the algoritm was stored');
    }
    this.initializeAlgorithmWithInputValue(this._inputData);
    this.runAutoStepAlgorithm();
  }
}
