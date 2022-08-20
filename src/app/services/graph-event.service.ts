import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DataSet, Edge, Node, Position } from 'vis';
import { LabelIterator, NumericalLabelIterator } from '../graphHelpers/labelIterator';
import { GraphElementType } from '../types/element-config-dialog.types';
import { GraphDataService } from './graph-data.service';

@Injectable({
  providedIn: 'root',
})
export class GraphEventService {
  public _labelIterator: LabelIterator<any> = new NumericalLabelIterator();
  public elementType$ = new Subject<GraphElementType>();
  public elementId$ = new Subject<string>();
  public initialLabel$ = new Subject<string>();
  public position$ = new Subject<Position>();

  private _currentNodeId: number;
  private _currentEdgeId: number;

  constructor(private graphData: GraphDataService) {
    this._currentEdgeId = 0;
    this._currentNodeId = 0;

    this.graphData.graph$.subscribe((graph) => {
      if (!graph) {
        return;
      }

      const newOptions = {
        ...graphData['graphOptions'],
        manipulation: {
          enabled: false,
          editEdge: this.editEdgeCallback,
          addEdge: this.addEdgeCallback,
          addNode: this.addNodeCallback,
        },
      };

      newOptions!.edges!.chosen = {
        edge: this.hoverEdge as unknown as undefined,
      };

      graph.setOptions(newOptions);

      graph.on('selectEdge', (event) => {
        const edgeId = event.edges[0];
        const edge: Edge = this.graphData.graphNodes.get(edgeId);

        this.elementType$.next('edge');
        this.elementId$.next(edgeId);
        this.initialLabel$.next(edge.label as string);
        this.position$.next(event.pointer.DOM);
      });

      graph.on('selectNode', (event) => {
        const nodeId = event.nodes[0];
        const node: Node = this.graphData.graphNodes.get(nodeId) as Node;

        this.elementType$.next('node');
        this.elementId$.next(nodeId);
        this.initialLabel$.next(node.label as string);
        this.position$.next(event.pointer.DOM);
      });
    });
  }

  private hoverEdge = (edge: Edge, id: string, selected: boolean, hovering: boolean) => {
    edge.color = '#333333';
  };

  private editEdgeCallback = (data: any, callback: any) => {
    callback(data);
  };

  private addEdgeCallback = (data: any, callback: any) => {
    let edgeExists: boolean = false;
    this.graphData.graphEdges.forEach((edge) => {
      if (edge.from === data.from && edge.to === data.to) {
        edgeExists = true;
      }
    });
    if (edgeExists) {
      return;
    }

    data.id = this._currentEdgeId++;
    this.graphData.graphEdges.add(data);

    const toNodePositionCanvas: Position = this.graphData.graph.getPositions(data.to)[data.to];
    const toNodePositionDOM: Position = this.graphData.graph.canvasToDOM(toNodePositionCanvas);

    this.elementType$.next('edge');
    this.elementId$.next(data.id);
    this.initialLabel$.next(data.label);
    this.position$.next(toNodePositionDOM);
  };

  private addNodeCallback = (data: any, callback: any) => {
    data.label = this._labelIterator.next().value.toString();
    data.id = this._currentNodeId++;
    this.graphData.graphNodes.add(data);

    const domClickPosition = this.graphData.graph.canvasToDOM({ x: data.x, y: data.y });

    this.elementType$.next('node');
    this.elementId$.next(data.id);
    this.initialLabel$.next(data.label);
    this.position$.next(domClickPosition);
  };

  public generateNewNodes(amount: number) {
    this.graphData.graphNodes.clear();
    this._currentNodeId = 0;
    this._labelIterator.reset();

    const newNodes: Node[] = [];

    for (let i = 0; i < amount; i++) {
      newNodes.push({ id: this._currentNodeId, label: this._labelIterator.next().value });
      this._currentNodeId++;
    }
    console.log(newNodes)
    console.log(new DataSet<Node>(newNodes))
    this.graphData.graphNodes = new DataSet<Node>(newNodes);

    this.graphData.graphEdges = new DataSet<Edge>([
      { from: 0, to: 2, label: '1' },
      { from: 0, to: 1, label: '1' },
      { from: 1, to: 3, label: '1' },
      { from: 1, to: 4, label: '1' },
    ]);
  }
}
