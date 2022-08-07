import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataSet, Edge, Network, Node, Options } from 'vis';

@Injectable({
  providedIn: 'root',
})
export class GraphDataService {
  private labelFontsizeInPx = 20;

  private hoverEdge = (
    edge: Edge,
    id: string,
    selected: boolean,
    hovering: boolean
  ) => {
    edge.color = '#333333';
  };

  private editEdgeCallback = (data: any, callback: any) => {
    callback(data);
  };

  private addEdgeCallback = (data: any, callback: any) => {
    let edgeExists: boolean = false;
    this._graphEdges.forEach((edge) => {
      if (edge.from === data.from && edge.to === data.to) {
        edgeExists = true;
      }
    });
    if (edgeExists) {
      callback(null);
    }
    callback(data);
    //TODO: Show gui to edit edge
  };

  private addNodeCallback = (data: any, callback: any) => {
    //TODO: Show gui to add node
    this._currentId = this._currentId + 1;
    callback(data)
  };

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
    chosen: {
      edge: this.hoverEdge as unknown as undefined,
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

  public graphOptions: Options = {
    autoResize: true,
    height: '100%',
    width: '100%',
    locale: 'en',
    clickToUse: false,
    edges: this.edgeOptions,
    nodes: this.nodeOptions,
    interaction: {
      hideEdgesOnDrag: true,
      hover: true,
      multiselect: true,
    },
    manipulation: {
      enabled: false,
      editEdge: this.editEdgeCallback,
      addEdge: this.addEdgeCallback,
      addNode: this.addNodeCallback,
    },
    physics: {
      enabled: false,
    },
  };

  private _graph!: Network;
  private _graphNodes = new DataSet<Node>();
  private _graphEdges = new DataSet<Edge>();
  private _currentId;
  public selectedEdge$ = new BehaviorSubject<null | string>(null);

  public get graph() {
    return this._graph;
  }

  public set graph(newGraph: Network) {
    this._graph = newGraph;
    this._graph.on('selectEdge', () => {
      //TODO: Show gui to edit edge
    });
  }

  public get graphNodes() {
    return this._graphNodes;
  }

  public get graphEdges() {
    return this._graphEdges;
  }

  constructor() {
    this._graphNodes = new DataSet<Node>([
      { id: 0, label: 'Node 1' },
      { id: 1, label: 'Node 2' },
      { id: 2, label: 'Node 3' },
      { id: 3, label: 'Node 4' },
      { id: 4, label: 'Node 5' },
    ]);

    this._graphEdges = new DataSet<Edge>([
      { from: 0, to: 2, label: '1' },
      { from: 0, to: 1, label: '1' },
      { from: 1, to: 3, label: '1' },
      { from: 1, to: 4, label: '1' },
    ]);

    this._currentId = this._graphNodes.length;
  }

  public addNode() {
    this._graph.addNodeMode();
  }

  public addEdge() {
    this._graph.addEdgeMode();
  }
}
