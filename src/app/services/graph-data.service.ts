import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataSet, Edge, Network, Node, Options } from 'vis';

@Injectable({
  providedIn: 'root',
})
export class GraphDataService {
  private labelFontsizeInPx = 20;

  public graph$ = new BehaviorSubject<Network | null>(null);

  private edgeOptions = {
    arrows: {
      to: {
        enabled: true,
        type: 'arrow',
      },
    },
    arrowStrikethrough: false,
    color: {
      color: '#000000',
      highlight: '#011E39',
    },
    font: {
      color: '#000000',
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
      border: '#000000',
      background: '#FFFFFF',
      highlight: '#011E39',
    },
    shape: 'circle',
  };

  public graphOptions: Options = {
    autoResize: true,
    height: '100%',
    width: '100%',
    locale: 'en',
    clickToUse: false,
    edges: this.edgeOptions,
    nodes: this.nodeOptions,
    interaction: {
      hideEdgesOnDrag: false,
      hover: true,
      multiselect: true,
      hoverConnectedEdges: false,
      selectConnectedEdges: false,
    },
    physics: {
      enabled: false,
      barnesHut: {
        avoidOverlap: 0.1,
      },
    },
  };

  private _graph!: Network;
  private _graphNodes = new DataSet<Node>();
  private _graphEdges = new DataSet<Edge>();

  public get graph() {
    return this._graph;
  }

  public assignGraph(newGraph: Network) {
    this._graph = newGraph;
    this.graph$.next(newGraph);
    //@ts-ignore
    this._graphEdges = newGraph.body.data.edges;
    //@ts-ignore
    this._graphNodes = newGraph.body.data.nodes;
  }

  public get graphNodes() {
    return this._graphNodes;
  }

  public get graphEdges() {
    return this._graphEdges;
  }

  public set graphNodes(newNodes: DataSet<Node>) {
    this._graphNodes = newNodes;
  }

  public set graphEdges(newEdges: DataSet<Edge>) {
    this._graphEdges = newEdges;
  }

  constructor() {
    this._graphNodes = new DataSet<Node>(new Array(6).fill(0).map((_, index) => ({ id: index + 1, label: '' + (index + 1) })));

    this._graphEdges = new DataSet<Edge>([
      { from: 1, to: 6, label: '14' },
      { from: 1, to: 2, label: '7' },
      { from: 1, to: 3, label: '9' },
      { from: 2, to: 3, label: '10' },
      { from: 2, to: 4, label: '15' },
      { from: 3, to: 6, label: '2' },
      { from: 3, to: 4, label: '11' },
      { from: 6, to: 5, label: '9' },
      { from: 4, to: 5, label: '6' },
    ]);
  }

  public enterAddNodeMode() {
    this._graph.addNodeMode();
  }

  public enterAddEdgeMode() {
    this._graph.addEdgeMode();
    this._graph.on('click', () => this._graph.disableEditMode());
  }

  public disablePhysics() {
    //@ts-ignore
    this._graph.physics.physicsEnabled = false;
  }

  public enablePhysics() {
    //@ts-ignore
    this._graph.physics.physicsEnabled = true;
  }
}
