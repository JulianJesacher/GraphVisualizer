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
    this._graphNodes = new DataSet<Node>([
      { id: 10, label: 'Id 10' },
      { id: 11, label: 'Id 11' },
      { id: 12, label: 'Id 12' },
      { id: 13, label: 'Id 13' },
      { id: 14, label: 'Id 14' },
    ]);

    this._graphEdges = new DataSet<Edge>([
      { from: 10, to: 12, label: '1' },
      { from: 10, to: 11, label: '1' },
      { from: 11, to: 13, label: '1' },
      { from: 11, to: 14, label: '1' },
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
