import { Injectable } from '@angular/core';
import { GraphDataService } from 'src/app/services/graph-data.service';
import { DataSet, Edge, Network, Node } from 'vis';
import { NumberInterval } from '../types/utils.types';
import { GraphEventService } from './graph-event.service';

export type EdgeWeightInterval = NumberInterval;

@Injectable({
  providedIn: 'root',
})
export class GraphGeneratorService {
  constructor(private graphData: GraphDataService, private graphEvents: GraphEventService) {}

  public randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateNewNodes(nodeCount: number): Node[] {
    const newNodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      newNodes.push(this.graphEvents.generateNewNode());
    }
    return newNodes;
  }

  private generateNewEdges(maxOutDegree: number, minOutDegree: number, nodes: Node[], weightInterval: EdgeWeightInterval): Edge[] {
    const newEdges: Edge[] = [];

    for (let currentNode of nodes) {
      const currentNodeSelectedNeighbours: Node[] = [];
      const outDegree = Math.floor(this.randomInt(minOutDegree, maxOutDegree));

      let i = 0;
      while (i <= outDegree) {
        const randomNeighbour: Node = nodes[this.randomInt(0, nodes.length - 1)];

        // If not enough nodes provided to achieve the selected outDegree, and all nodes are chosen as neighbours, the loop gets exited
        if (currentNodeSelectedNeighbours.length == nodes.length - 1) {
          //-1 to account for the current node because self-edges are not desired
          break;
        }
        // If selected node is already a selected neighbour or it is the currently processed node, continue and choose another one
        if (currentNodeSelectedNeighbours.includes(randomNeighbour) || randomNeighbour === currentNode) {
          continue;
        }

        currentNodeSelectedNeighbours.push(randomNeighbour);
        const edgeWeight = this.randomInt(weightInterval.min, weightInterval.max);

        newEdges.push(this.graphEvents.generateNewEdge(currentNode.id, randomNeighbour.id, edgeWeight));
        i++;
      }
    }
    return newEdges;
  }

  public generateGraph(amountNodes: number, edgeWeightInterval: EdgeWeightInterval, maxOutDegree: number, minOutDegree: number = 0) {
    this.graphEvents.clearNodesAndResetIteratorAndId();
    this.graphEvents.clearEdgesAndResetId();
    const newNodes = this.generateNewNodes(amountNodes);
    const newEdges = this.generateNewEdges(maxOutDegree, minOutDegree, newNodes, edgeWeightInterval);

    const newGraphData = {
      nodes: new DataSet<Node>(newNodes),
      edges: new DataSet<Edge>(newEdges),
    };
    //@ts-ignore
    const graphContainer = this.graphData.graph.body.container;
    this.graphData.assignGraph(new Network(graphContainer, newGraphData, this.graphData.graphOptions));
  }
}
