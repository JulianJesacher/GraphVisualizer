import { Injectable } from '@angular/core';
import { AlgorithmGroup, GraphAlgorithm, GraphAlgorithmInput } from '../types/algorithm.types';
import { GraphEventService } from './graph-event.service';
import { BehaviorSubject } from 'rxjs';
import { Node } from 'vis';
import { AlgorithmService } from './algorithm.service';

@Injectable({
  providedIn: 'root',
})
export class AlgorithmInitializerService {
  private _algorithm?: GraphAlgorithm = undefined;
  public initializingProcessActive$ = new BehaviorSubject<boolean>(false);
  public graphPayload$ = new BehaviorSubject<GraphAlgorithmInput | null>(null);

  constructor(private graphEvent: GraphEventService, private algorithmService: AlgorithmService) {
    this.graphEvent.selectedNode$.subscribe(this.handleSelectedNode);
  }

  set_algorithm(newAlgorithm: GraphAlgorithm) {
    this._algorithm = newAlgorithm;
    this.initializingProcessActive$.next(true);
  }

  handleSelectedNode(selectedNode: Node) {
    if (!this._algorithm || !this.initializingProcessActive$.value) {
      return;
    }

    switch (this._algorithm.type) {
      case AlgorithmGroup.TRAVERSAL:
        this.graphPayload$.next({ startNode: selectedNode });
        this.start_algorithm();
        break;
      default:
        throw new Error('Not implemented');
    }
  }

  start_algorithm() {
    if (!this._algorithm) {
      throw new Error('Can not start because no algorithm is selected!');
    }
    if (!this.graphPayload$.value) {
      throw new Error('Can not start because no algorithm input value selected!');
    }
    this.algorithmService.setAlgorithm(this._algorithm.startAlgorithm);
    this.algorithmService.initializeAlgorithmWithInputValue(this.graphPayload$.value);
  }
}
