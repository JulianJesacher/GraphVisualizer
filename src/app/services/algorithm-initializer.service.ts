import { Injectable } from '@angular/core';
import { AlgorithmGroup, AlgorithmInputNodeType, GraphAlgorithm, GraphAlgorithmInput } from '../types/algorithm.types';
import { GraphEventService } from './graph-event.service';
import { BehaviorSubject } from 'rxjs';
import { Node } from 'vis';
import { AlgorithmService } from './algorithm.service';
import { NodeSelection, SelectedNodeInformation } from '../types/algorithm-intializer-dialog.types';
import { GraphPainterService } from './graph-painter.service';

@Injectable({
  providedIn: 'root',
})
export class AlgorithmInitializerService {
  private _algorithm?: GraphAlgorithm | null;
  private _currentNodeSelection?: NodeSelection | null;

  public initializingProcessActive$ = new BehaviorSubject<boolean>(false);
  public currentGraphPayload$ = new BehaviorSubject<GraphAlgorithmInput | null>(null);
  public algorithmGroup$ = new BehaviorSubject<AlgorithmGroup | null>(null);
  public selectedNodesInformation$ = new BehaviorSubject<SelectedNodeInformation[]>([]);

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
    this.selectedNodesInformation$.next([]);
  }

  setCurrentNodeSelection(newSelection: NodeSelection) {
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
    this.clear();
  }

  handleSelectedNode(selectedNode: Node) {
    if (!this._algorithm || !this.initializingProcessActive$.value || !this._currentNodeSelection) {
      return;
    }

    const currentNodesInformation = this.selectedNodesInformation$.value;
    if (!currentNodesInformation) {
      throw new Error('No node information is available!');
    }

    const updatedNodeInformation = currentNodesInformation
      .filter((nodeInformation) => nodeInformation.nodeStepIndex != this._currentNodeSelection?.nodeStepIndex)
      .concat({ ...this._currentNodeSelection, node: selectedNode }); // Concat because push returns the length of the new array

    this.selectedNodesInformation$.next(updatedNodeInformation);
    this.graphPainter.paintBySelectedNodeInformation(updatedNodeInformation);

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
  }

  clear() {
    this._currentNodeSelection = null;
    this._algorithm = null;
    this.currentGraphPayload$.next(null);
    this.selectedNodesInformation$.next([]);
    this.initializingProcessActive$.next(false);
    this.graphPainter.removePaintFromAllNodes();
  }
}
