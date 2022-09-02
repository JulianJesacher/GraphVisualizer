import { Injectable } from '@angular/core';
import {
  AlgorithmGroup,
  AlgorithmInputNodeType,
  GraphAlgorithmInput,
  isSPSPAlgorithmInput,
  isTraversalAlgorithmInput,
  isSSSPAlgorithmInput,
} from '../types/algorithm.types';
import { GraphEventService } from './graph-event.service';
import { BehaviorSubject } from 'rxjs';
import { Node } from 'vis';
import { AlgorithmService } from './algorithm.service';
import { NodeSelection, SelectedNodeInformation } from '../types/algorithm-initializer-dialog.types';
import { GraphPainterService } from './graph-painter.service';
import { environment } from 'src/environments/environment';
import { GraphAlgorithm } from '../algorithms/abstract/base.algorithm';

@Injectable({
  providedIn: 'root',
})
export class AlgorithmInitializerService {
  private _algorithm?: GraphAlgorithm | null;
  private _currentNodeSelection?: NodeSelection | null;
  private _currentGraphPayload: GraphAlgorithmInput | null = null;

  public initializingProcessActive$ = new BehaviorSubject<boolean>(false);
  public algorithmGroup$ = new BehaviorSubject<AlgorithmGroup | null>(null);
  public selectedNodesInformation$ = new BehaviorSubject<SelectedNodeInformation[]>([]);

  constructor(
    private graphEvent: GraphEventService,
    private algorithmService: AlgorithmService,
    private graphPainter: GraphPainterService
  ) {
    this.graphEvent.selectedNode$.subscribe((selectedNode) => this.handleSelectedNode(selectedNode));
  }

  setAlgorithmAndStartInitialization(newAlgorithm: GraphAlgorithm) {
    this._algorithm = newAlgorithm;
    this.initializingProcessActive$.next(true);
    this.algorithmGroup$.next(newAlgorithm.group);
    this.selectedNodesInformation$.next([]);
    this.graphPainter.clearPaint();
    this.algorithmService.clear();
    this._currentGraphPayload = newAlgorithm.emptyInputData;
  }

  setCurrentNodeSelection(newSelection: NodeSelection) {
    this._currentNodeSelection = newSelection;
  }

  startAlgorithm() {
    if (!this._algorithm) {
      throw new Error('Can not start because no algorithm is selected!');
    }
    if (!this._currentGraphPayload) {
      throw new Error('Can not start because no algorithm input value selected!');
    }
    if (Object.values(this._currentGraphPayload).some((value) => !value)) {
      throw new Error('Can not start because not all required algorithm input properties were set!');
    }

    this.algorithmService.setAlgorithm(this._algorithm);
    this.algorithmService.initializeAlgorithmWithInputValue(this._currentGraphPayload);
    this.clear();
  }

  handleSelectedNode(selectedNode: Node) {
    if (!this._algorithm || !this.initializingProcessActive$.value || !this._currentNodeSelection) {
      if (!environment.production) {
        console.log('DC 1000: The node selection has not been handled due to a missing property.');
      }
      return;
    }

    const currentNodesInformation = this.selectedNodesInformation$.value;
    if (!currentNodesInformation) {
      throw new Error('No node information is available!');
    }

    switch (this._algorithm.group) {
      case AlgorithmGroup.TRAVERSAL:
        this.handleNodeForTraversal(selectedNode);
        break;
      case AlgorithmGroup.SPSP:
        this.handleNodeForSPSP(selectedNode);
        break;
      case AlgorithmGroup.SSSP:
        this.handleNodeForSSSP(selectedNode);
        break;
      default:
        throw new Error('Not implemented');
    }

    const updatedNodeInformation = currentNodesInformation
      .filter((nodeInformation) => nodeInformation.nodeStepIndex != this._currentNodeSelection?.nodeStepIndex)
      .concat({ ...this._currentNodeSelection, node: selectedNode }); // Concat because push returns the length of the new array

    this.selectedNodesInformation$.next(updatedNodeInformation);
    this.graphPainter.paintBySelectedNodeInformation(updatedNodeInformation);
  }

  handleNodeForTraversal(selectedNode: Node) {
    if (!this._currentGraphPayload) {
      throw new Error('No input data available!');
    }
    if (!isTraversalAlgorithmInput(this._currentGraphPayload)) {
      throw new Error('The wrong input type is set, expected traversal algorithm input!');
    }

    this._currentGraphPayload[AlgorithmInputNodeType.START_NODE] = selectedNode;
  }

  handleNodeForSPSP(selectedNode: Node) {
    if (!this._currentGraphPayload) {
      throw new Error('No input data available!');
    }
    if (!this._currentNodeSelection) {
      throw new Error('No node selection was provided!');
    }

    if (!isSPSPAlgorithmInput(this._currentGraphPayload)) {
      throw new Error('The wrong input type is set, expected spsp algorithm input!');
    }

    this._currentGraphPayload[this._currentNodeSelection.nodeType] = selectedNode;
  }

  handleNodeForSSSP(selectedNode: Node) {
    if (!this._currentGraphPayload) {
      throw new Error('No input data available!');
    }
    if (!isSSSPAlgorithmInput(this._currentGraphPayload)) {
      throw new Error('The wrong input type is set, expected sssp algorithm input!');
    }
    this._currentGraphPayload[AlgorithmInputNodeType.START_NODE] = selectedNode;
  }

  clear() {
    this._currentNodeSelection = null;
    this._algorithm = null;
    this._currentGraphPayload = null;
    this.selectedNodesInformation$.next([]);
    this.initializingProcessActive$.next(false);
    this.graphPainter.clearPaint();
  }
}
