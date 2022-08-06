import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DataSet, Network, Options } from 'vis';
import { GraphDataService } from '../../services/graph-data.service';

@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.css'],
})
export class GraphComponentComponent implements AfterViewInit {
  @ViewChild('graphContainer') graphContainer!: ElementRef;
  private graph: any;

  constructor(private graphData: GraphDataService) {}

  ngAfterViewInit() {
    const container = this.graphContainer.nativeElement;   
    const data = { nodes: this.graphData.graphNodes, edges: this.graphData.graphEdges };
    this.graph = new Network(container, data, this.graphData.graphOptions);
    this.graphData.graph = this.graph;
  }
}