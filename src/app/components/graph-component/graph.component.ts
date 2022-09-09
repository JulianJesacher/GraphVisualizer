import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { GraphElementDialogService } from 'src/app/services/graph-element-dialog.service';
import { GraphElementDeleteEvent, GraphElementUpdateEvent } from 'src/app/types/element-config-dialog.types';
import { Network } from 'vis';
import { GraphDataService } from '../../services/graph-data.service';
import { GraphElementConfigComponent } from '../graph-element-config/graph-element-config.component';
import { AlgorithmInitializerService } from '../../services/algorithm-initializer.service';
import { UpdateCurrentNodeSelectionEvent } from '../../types/algorithm-initializer-dialog.types';
import { UserInformationService } from 'src/app/services/user-information.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements AfterViewInit {
  @ViewChild('graphContainer') graphContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('configComponent') configComponent!: GraphElementConfigComponent;

  // HostListener to close config element if a click outside occured
  @HostListener('document:click', ['$event'])
  clickedOutsideConfig(event: MouseEvent) {
    if (!this.configComponent || this.elementDialog.openConfigClick) {
      this.elementDialog.openConfigClick = false;
      return;
    }

    if (event.target instanceof Node && !this.configComponent.container.nativeElement.contains(event.target)) {
      this.closeElementConfigDialog();
    }
  }

  constructor(
    private graphData: GraphDataService,
    public elementDialog: GraphElementDialogService,
    public algorithmInitializer: AlgorithmInitializerService,
    private informationService: UserInformationService
  ) {}

  ngAfterViewInit() {
    const container = this.graphContainer.nativeElement;
    const data = {
      nodes: this.graphData.graphNodes,
      edges: this.graphData.graphEdges,
    };
    this.graphData.assignGraph(new Network(container, data, this.graphData.graphOptions));
  }

  closeElementConfigDialog() {
    this.elementDialog.position$.next(null);
    this.elementDialog.openConfigClick = false;
  }

  deleteElement(deleteEvent: GraphElementDeleteEvent) {
    switch (deleteEvent.type) {
      case 'node':
        this.graphData.graphNodes.remove(deleteEvent.id);
        break;
      case 'edge':
        this.graphData.graphNodes.remove(deleteEvent.id);
        break;
    }
    this.closeElementConfigDialog();
  }

  updateElement(updateEvent: GraphElementUpdateEvent) {
    if (updateEvent.updatedData.label != undefined) {
      switch (updateEvent.type) {
        case 'node':
          this.graphData.graphNodes.update({ id: updateEvent.id, label: updateEvent.updatedData.label });
          break;
        case 'edge':
          this.graphData.graphEdges.update({ id: updateEvent.id, label: updateEvent.updatedData.label });
          break;
      }
    }

    if (updateEvent.updatedData.changeEdgeDirection && updateEvent.type === 'edge') {
      const currentEdge = this.graphData.graphEdges.get(updateEvent.id);

      if (currentEdge?.from != undefined && currentEdge?.to != undefined) {
        this.graphData.graphEdges.update({ id: updateEvent.id, from: currentEdge.to, to: currentEdge.from });
      }
    }
  }

  updateCurrentNodeSelection(updateEvent: UpdateCurrentNodeSelectionEvent) {
    this.algorithmInitializer.setCurrentNodeSelection(updateEvent);
  }

  confirmInputData() {
    this.algorithmInitializer.startAlgorithm();
  }

  closeInitializingDialog() {
    this.algorithmInitializer.clear();
  }

  //Delegate click information to algorithm initializer
  confirmDialogConfirmCallback(): void {
    this.algorithmInitializer.confirmDialogConfirmClicked();
  }
  //Delegate click information to algorithm initializer
  confirmDialogRejectCallback(): void {
    this.algorithmInitializer.confirmDialogRejectClicked();
  }

  showTutorial(): void {
    this.informationService.showTutorial();
  }
}
