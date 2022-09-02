import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { GraphDataService } from 'src/app/services/graph-data.service';
import { GraphGeneratorService } from 'src/app/services/graph-generator.service';
import { AutoRunButtonState } from 'src/app/types/algorithm.types';
import { AlgorithmService } from '../../services/algorithm.service';
import { AlgorithmInitializerService } from '../../services/algorithm-initializer.service';
import { BfsTraversalAlgorithm } from '../../algorithms/traversal/bfs.algorithm';
import { DijkstraSSSPAlgorithm } from 'src/app/algorithms/sssp/dijksta-sssp.algorithm';
import { DijkstraSPSPAlgorithm } from '../../algorithms/spsp/dijkstra-spsp.algorithm';
import { FloydWarshallAPSPAlgorithm } from '../../algorithms/apsp/floyd-warshall.algorithm';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  @ViewChild('dropdownContainerLeft') dropdownContainerLeft!: ElementRef<HTMLDivElement>;
  @ViewChild('dropdownContainerRight') dropdownContainerRight!: ElementRef<HTMLDivElement>;

  @ViewChild('toggleDropdownLeft') toggleDropdownLeft!: ElementRef<HTMLButtonElement>;
  @ViewChild('toggleDropdownRight') toggleDropdownRight!: ElementRef<HTMLButtonElement>;

  public middleButtonState = AutoRunButtonState.RUN;
  public buttonStates = AutoRunButtonState;

  constructor(
    private graphData: GraphDataService,
    public algorithmService: AlgorithmService,
    private graphGenerator: GraphGeneratorService,
    private algorithmInitializer: AlgorithmInitializerService
  ) {
    this.algorithmService.autoRunButtonState$.subscribe((newState) => (this.middleButtonState = newState));
  }

  ngOnInit(): void {}

  addNode() {
    this.graphData.enterAddNodeMode();
  }

  addEdge() {
    this.graphData.enterAddEdgeMode();
  }

  previousStep() {
    this.algorithmService.stopAutoStepAlgorithm();
    this.algorithmService.stepBackward();
  }

  nextStep() {
    this.algorithmService.stopAutoStepAlgorithm();
    this.algorithmService.stepForward();
  }

  algorithmAutoStepButtonClicked() {
    switch (this.middleButtonState) {
      case AutoRunButtonState.RUN:
        this.algorithmService.runAutoStepAlgorithm();
        break;
      case AutoRunButtonState.STOP:
        this.algorithmService.stopAutoStepAlgorithm();
        break;
      case AutoRunButtonState.REPEAT:
        this.algorithmService.repeatAlgorithm();
        break;
    }
  }

  generateGraph() {
    this.graphGenerator.generateGraph(15, { min: 2, max: 10 }, 2);
  }

  toggleDropdown(button: HTMLButtonElement) {
    if (button === this.toggleDropdownRight.nativeElement) {
      this.dropdownContainerRight.nativeElement.classList.toggle('visible');
    } else if (button === this.toggleDropdownLeft.nativeElement) {
      this.dropdownContainerLeft.nativeElement.classList.toggle('visible');
    }
  }

  // HostListener to close dropdown menus, if a click outside of the toggle buttons was detected
  @HostListener('document:click', ['$event'])
  clickedOutsideDropdownToggle(event: MouseEvent) {
    if (event.target instanceof Node && !this.toggleDropdownLeft.nativeElement.contains(event.target)) {
      this.dropdownContainerLeft.nativeElement.classList.remove('visible');
    }
    if (event.target instanceof Node && !this.toggleDropdownRight.nativeElement.contains(event.target)) {
      this.dropdownContainerRight.nativeElement.classList.remove('visible');
    }
  }

  selectBFS() {
    this.algorithmInitializer.setAlgorithmAndStartInitialization(new BfsTraversalAlgorithm());
  }
  selectDijkstraSSSP() {
    this.algorithmInitializer.setAlgorithmAndStartInitialization(new DijkstraSSSPAlgorithm());
  }
  selectDijkstraSPSP() {
    this.algorithmInitializer.setAlgorithmAndStartInitialization(new DijkstraSPSPAlgorithm());
  }
  selectFloydWarshallAPSP(){
    this.algorithmInitializer.setAlgorithmAndStartInitialization(new FloydWarshallAPSPAlgorithm());
  }
}
