import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Edge, Network, Node } from 'vis';
import { GraphDataService } from '../../services/graph-data.service';

@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.css'],
})
export class GraphComponentComponent implements AfterViewInit {
  @ViewChild('graphContainer') graphContainer!: ElementRef;
  public edgeConfigVisible!: boolean;
  public nodeConfigVisible!: boolean;
  public position!: { x: number; y: number };
  public edgeId!: number;
  public nodeId!: number;

  constructor(private graphData: GraphDataService) {}

  ngAfterViewInit() {
    const container = this.graphContainer.nativeElement;
    const data = {
      nodes: this.graphData.graphNodes,
      edges: this.graphData.graphEdges,
    };
    this.graphData.graph = new Network(
      container,
      data,
      this.graphData.graphOptions
    );

    this.graphData.graph.on('selectNode', (event) => {
      console.log('node', event);
      this.nodeConfigVisible = true;
      this.edgeConfigVisible = false;
      this.position = { x: event.pointer.DOM.x, y: event.pointer.DOM.y };
      this.nodeId = event.nodes[0];
    });

    this.graphData.graph.on('selectEdge', (event) => {
      console.log('edge', event);
      this.edgeConfigVisible = true;
      this.nodeConfigVisible = false;
      this.position = { x: event.pointer.DOM.x, y: event.pointer.DOM.y };
      this.edgeId = event.edges[0];
    });

    this.graphData.graph.on('click', (event) => {
      console.log(event.pointer.DOM.x + ', ' + event.pointer.DOM.y);
    });
  }
}
