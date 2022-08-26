import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { bfsAlgorithm } from 'src/app/algorithms/bfs.algorithm';
import { GraphDataService } from 'src/app/services/graph-data.service';
import { GraphGeneratorService } from 'src/app/services/graph-generator.service';
import { GraphPainterService } from 'src/app/services/graph-painter.service';
import { AutoRunButtonState } from 'src/app/types/algorithm.types';
import { Node } from 'vis';
import { AlgorithmService } from '../../services/algorithm.service';

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
    private graphPainter: GraphPainterService
  ) {
    this.algorithmService.autoRunButtoonState$.subscribe((newState) => (this.middleButtonState = newState));
  }

  ngOnInit(): void {
    this.algorithmService.setAlgorithm(bfsAlgorithm);
    //TODO: Remove
    this.algorithmService.initializeAlgorithmWithInputValue({ startNode: this.graphData.graphNodes.get(10) as unknown as Node }); //TODO: remove
  }

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
      case AutoRunButtonState.STOPP:
        this.algorithmService.stopAutoStepAlgorithm();
        break;
      case AutoRunButtonState.REPEAT:
        this.algorithmService.repeatAlgorithm();
        break;
    }
  }

  generateGraph() {
    this.graphGenerator.generateGraph(40, { min: 10, max: 10 }, 3);
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
}
