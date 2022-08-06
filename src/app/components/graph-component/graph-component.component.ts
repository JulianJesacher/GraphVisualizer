import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DataSet, Network, Options } from 'vis';

@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.css'],
})
export class GraphComponentComponent implements AfterViewInit {
  @ViewChild('graphContainer') graphContainer!: ElementRef;
  private graph: any;

  private labelFontsizeInPx = 20;

  private edgeOptions = {
    arrows: {
      to: {
        enabled: true,
        type: 'arrow',
      },
    },
    arrowStrikethrough: false,
    color: {
      color: '#FFFFFF',
      highlight: '#011E39',
    },
    font: {
      color: '#FFFFFF',
      strokeWidth: 0,
      size: this.labelFontsizeInPx,
      vadjust: this.labelFontsizeInPx,
    },
    shadow: true,
    smooth: true,
  };

  private nodeOptions = {
    borderWidth: 2,
    color: {
      border: '#222222',
      background: '#FFFFFF',
      highlight: '#011E39',
    },
    shape: 'circle',
  };

  private graphOptions: Options = {
    autoResize: true,
    height: '100%',
    width: '100%',
    locale: 'en',
    clickToUse: false,
    edges: this.edgeOptions,
    nodes: this.nodeOptions,
    interaction: {
      hideEdgesOnDrag: true,
      hideEdgesOnZoom: true,
      hover: true,
      multiselect: true,
    },
    manipulation: {
      enabled: true,
    },
    physics: {
      enabled: false,
    },
  };

  constructor() {}

  ngAfterViewInit() {
    console.log(this.graphContainer);
    const container = this.graphContainer.nativeElement;
    const nodes = new DataSet<any>([
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
      { id: 4, label: 'Node 4' },
      { id: 5, label: 'Node 5' },
    ]);

    const edges = new DataSet<any>([
      { from: 1, to: 3, label: '1' },
      { from: 1, to: 2, label: '1' },
      { from: 2, to: 4, label: '1' },
      { from: 2, to: 5, label: '1' },
    ]);
    const data = { nodes, edges };

    this.graph = new Network(container, data, this.graphOptions);
  }
}
