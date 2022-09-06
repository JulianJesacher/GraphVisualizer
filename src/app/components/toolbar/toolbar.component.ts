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
import { MessageService } from 'primeng/api';

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
    private algorithmInitializer: AlgorithmInitializerService,
    private messageService: MessageService
  ) {
    this.algorithmService.autoRunButtonState$.subscribe((newState) => (this.middleButtonState = newState));
  }

  ngOnInit(): void {}

  addNode() {
    this.graphData.enterAddNodeMode();
    this.closeDropdown(this.dropdownContainerLeft);
  }

  addEdge() {
    this.graphData.enterAddEdgeMode();
    this.closeDropdown(this.dropdownContainerLeft);
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
    if (!this.algorithmService.algorithmRunnable$.value) {
      this.messageService.add({
        key: 'toast',
        severity: 'error',
        summary: 'Error',
        detail: 'No algorithm was selected. \nUse the top right button to select an algorithm first!',
      });
      return;
    }

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
    this.closeDropdown(this.dropdownContainerLeft);
  }

  toggleDropdown(button: HTMLButtonElement) {
    if (button === this.toggleDropdownRight.nativeElement) {
      this.dropdownContainerRight.nativeElement.classList.toggle('visible');
    } else if (button === this.toggleDropdownLeft.nativeElement) {
      this.dropdownContainerLeft.nativeElement.classList.toggle('visible');
    }
  }

  closeDropdown(dropdownContainer: ElementRef<HTMLDivElement>) {
    dropdownContainer.nativeElement.classList.remove('visible');
  }

  // HostListener to close dropdown menus, if a click outside of the toggle buttons was detected
  @HostListener('document:click', ['$event'])
  clickedOutsideDropdownToggle(event: MouseEvent) {
    if (!(event.target instanceof Node)) {
      return;
    }
    if (!this.toggleDropdownLeft.nativeElement.contains(event.target) && !this.dropdownContainerLeft.nativeElement.contains(event.target)) {
      this.closeDropdown(this.dropdownContainerLeft);
    }
    if (
      !this.toggleDropdownRight.nativeElement.contains(event.target) &&
      !this.dropdownContainerRight.nativeElement.contains(event.target)
    ) {
      this.closeDropdown(this.dropdownContainerRight);
    }
  }

  selectBFS() {
    this.algorithmInitializer.setAlgorithmAndStartInitialization(new BfsTraversalAlgorithm());
    this.closeDropdown(this.dropdownContainerRight);
  }
  selectDijkstraSSSP() {
    this.algorithmInitializer.setAlgorithmAndStartInitialization(new DijkstraSSSPAlgorithm());
    this.closeDropdown(this.dropdownContainerRight);
  }
  selectDijkstraSPSP() {
    this.algorithmInitializer.setAlgorithmAndStartInitialization(new DijkstraSPSPAlgorithm());
    this.closeDropdown(this.dropdownContainerRight);
  }
  selectFloydWarshallAPSP() {
    this.algorithmInitializer.setAlgorithmAndStartInitialization(new FloydWarshallAPSPAlgorithm());
    this.closeDropdown(this.dropdownContainerRight);
  }
}
