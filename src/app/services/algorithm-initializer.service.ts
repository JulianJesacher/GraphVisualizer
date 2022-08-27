import { Injectable } from '@angular/core';
import { AlgorithmGroup, AlgorithmInputNodeType, GraphAlgorithm, GraphAlgorithmInput } from '../types/algorithm.types';
import { GraphEventService } from './graph-event.service';
import { BehaviorSubject } from 'rxjs';
import { Node } from 'vis';
import { AlgorithmService } from './algorithm.service';
import { NodeSelection } from '../types/algorithm-intializer-dialog.types';
import { GraphPainterService } from './graph-painter.service';

@Injectable({
  providedIn: 'root',
})
export class AlgorithmInitializerService {
  private _algorithm?: GraphAlgorithm;
  private _currentNodeSelection?: NodeSelection;

  public initializingProcessActive$ = new BehaviorSubject<boolean>(false);
  public currentGraphPayload$ = new BehaviorSubject<GraphAlgorithmInput | null>(null);
  public algorithmGroup$ = new BehaviorSubject<AlgorithmGroup | null>(null);

  constructor(
    private graphEvent: GraphEventService,
    private algorithmService: AlgorithmService,
    private graphPainter: GraphPainterService
  ) {
    this.graphEvent.selectedNode$.subscribe((selectedNode) => this.handleSelectedNode(selectedNode));
  }

  setAlgorithm(newAlgorithm: GraphAlgorithm) {
    this._algorithm = newAlgorithm;
    this.initializingProcessActive$.next(true);
    this.algorithmGroup$.next(newAlgorithm.group);
  }

  setCurrentNodeSelection(newSelection: NodeSelection) {
    console.log(newSelection);
    this._currentNodeSelection = newSelection;
  }

  startAlgorithm() {
    if (!this._algorithm) {
      throw new Error('Can not start because no algorithm is selected!');
    }
    if (!this.currentGraphPayload$.value) {
      throw new Error('Can not start because no algorithm input value selected!');
    }
    this.algorithmService.setAlgorithm(this._algorithm.startAlgorithm);
    this.algorithmService.initializeAlgorithmWithInputValue(this.currentGraphPayload$.value);
  }

  handleSelectedNode(selectedNode: Node) {
    if (!this._algorithm || !this.initializingProcessActive$.value || !this._currentNodeSelection) {
      return;
    }

    switch (this._algorithm.group) {
      case AlgorithmGroup.TRAVERSAL:
        this.handleNodeForTraversal(selectedNode);
        break;
      default:
        throw new Error('Not implemented');
    }
  }

  handleNodeForTraversal(selectedNode: Node) {
    if (this._currentNodeSelection?.nodeType !== AlgorithmInputNodeType.START_NODE) {
      throw new Error('For traversal algorithms, only start nodes are allowe as input!');
    }

    this.currentGraphPayload$.next({ startNode: selectedNode });
    this.graphPainter.paintNodeByState(selectedNode.id, this._currentNodeSelection.color);
  }
}
