import { Injectable } from '@angular/core';
import { DataSet, Edge, Node } from 'vis';
import { GraphDataService } from './graph-data.service';

//TODO: Extract
interface State {
  nodes: DataSet<Node>;
  edges: DataSet<Edge>;
}

type GraphAlgorithmInput = { startNode: Node };

type GraphAlgorithm = (input: GraphAlgorithmInput) => Iterator<State>;

@Injectable({
  providedIn: 'root',
})
export class AlgorithmService {
  private stateHistory: State[] = [];
  private algorithm?: GraphAlgorithm;
  private currentStateIndex = -1;

  private graphNodes: DataSet<Node>;
  private graphEdges: DataSet<Edge>;

  constructor(private graphData: GraphDataService) {
    this.graphNodes = this.graphData.getNodes;
    this.graphEdges = this.graphData.getEdges;
  }

  setAlgorithm(newAlgorithm: GraphAlgorithm) {
    this.clear();
    this.algorithm = newAlgorithm;
  }

  clear() {
    this.stateHistory = [];
    this.currentStateIndex = -1;
  }

  stepForward() {
    // Iterator next oder weiter Function call
  }

  stepBackward() {
    // History eins zurück
  }
}
