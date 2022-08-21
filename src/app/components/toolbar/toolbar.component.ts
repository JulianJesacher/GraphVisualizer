import { Component, OnInit } from '@angular/core';
import { bfsAlgorithm } from 'src/app/algorithms/bfs.algorithm';
import { GraphDataService } from 'src/app/services/graph-data.service';
import { GraphGeneratorService } from 'src/app/services/graph-generator.service';
import { Node } from 'vis';
import { AlgorithmService } from '../../services/algorithm.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  constructor(
    private graphData: GraphDataService,
    private algorithmService: AlgorithmService,
    private graphGenerator: GraphGeneratorService
  ) {}

  ngOnInit(): void {
    this.algorithmService.setAlgorithm(bfsAlgorithm);
  }

  addNode() {
    this.graphData.enterAddNodeMode();
  }

  addEdge() {
    this.graphData.enterAddEdgeMode();
  }

  previousStep() {
    this.algorithmService.stepBackward();
  }

  nextStep() {
    this.algorithmService.stepForward();
  }

  start() {
    this.algorithmService.start({ startNode: this.graphData.graphNodes.get(10) as unknown as Node });
  }

  run() {
    this.algorithmService.runAlgorithm();
  }

  generateGraph() {
    this.graphGenerator.generateGraph(40, { min: 10, max: 10 }, 3);
  }
}
