import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { GraphElementDialogService } from 'src/app/services/graph-element-dialog.service';
import { Edge, Network, Node } from 'vis';
import { GraphDataService } from '../../services/graph-data.service';
import {
  GraphElementConfigComponent,
  GraphElementDeleteEvent,
  GraphElementUpdateEvent,
} from '../graph-element-config/graph-element-config.component';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements AfterViewInit {
  @ViewChild('graphContainer') graphContainer!: ElementRef<HTMLDivElement>;

  // HostListener to close config element if a click outside occured
  @HostListener('document:click', ['$event'])
  closeConfigs(event: MouseEvent) {}

  constructor(private graphData: GraphDataService, public elementDialog: GraphElementDialogService) {}

  ngAfterViewInit() {
    const container = this.graphContainer.nativeElement;
    const data = {
      nodes: this.graphData.getNodes,
      edges: this.graphData.getEdges,
    };
    this.graphData.assignGraph(new Network(container, data, this.graphData.graphOptions));
  }

  closeElementConfig() {
    this.elementDialog.position$.next(null);
  }

  deleteElement(deleteEvent: GraphElementDeleteEvent) {
    switch (deleteEvent.type) {
      case 'node':
        this.graphData.getNodes.remove(deleteEvent.id);
        break;
      case 'edge':
        this.graphData.getEdges.remove(deleteEvent.id);
        break;
    }
  }

  updateElement(updateEvent: GraphElementUpdateEvent) {
    switch (updateEvent.type) {
      case 'node':
        this.graphData.getNodes.update({ id: updateEvent.id, label: updateEvent.updatedData.label });
        break;
      case 'edge':
        this.graphData.getEdges.update({ id: updateEvent.id, label: updateEvent.updatedData.label });
        break;
    }
  }
}
