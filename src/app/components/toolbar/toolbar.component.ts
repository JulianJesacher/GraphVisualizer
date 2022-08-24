import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { bfsAlgorithm } from 'src/app/algorithms/bfs.algorithm';
import { GraphDataService } from 'src/app/services/graph-data.service';
import { GraphGeneratorService } from 'src/app/services/graph-generator.service';
import { Node } from 'vis';
import { AlgorithmService, AlgorithmState } from '../../services/algorithm.service';

enum ControlButtonState {
  PLAY,
  PAUSE,
  REPEAT,
}

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

  public middleButtonState = ControlButtonState.PLAY;
  public buttonStates = ControlButtonState;

  public forwardButtonDisabled = true;
  public backwardButtonDisabled = true;

  constructor(
    private graphData: GraphDataService,
    private algorithmService: AlgorithmService,
    private graphGenerator: GraphGeneratorService
  ) {
    this.algorithmService.algorithmState$.subscribe((newState: AlgorithmState) => {
      console.log('newstate', AlgorithmState[newState]);
      switch (newState) {
        case AlgorithmState.INITIAL_STATE:
          this.middleButtonState = ControlButtonState.PLAY;
          this.forwardButtonDisabled = false;
          this.backwardButtonDisabled = true;
          break;

        case AlgorithmState.PAUSE:
          this.middleButtonState = ControlButtonState.PLAY;
          this.forwardButtonDisabled = false;
          this.backwardButtonDisabled = false;
          break;

        case AlgorithmState.RUNNING:
          this.middleButtonState = ControlButtonState.PAUSE;
          this.forwardButtonDisabled = false;
          this.backwardButtonDisabled = false;
          break;

        case AlgorithmState.FINISHED:
          this.middleButtonState = ControlButtonState.REPEAT;
          this.forwardButtonDisabled = true;
          this.backwardButtonDisabled = false;
          break;

        case AlgorithmState.NOT_SELECTED:
          this.middleButtonState = ControlButtonState.PLAY;
          this.forwardButtonDisabled = true;
          this.backwardButtonDisabled = true;
          break;
      }
    });
  }

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

  runPauseAlgorithm() {
    this.algorithmService.start({ startNode: this.graphData.graphNodes.get(10) as unknown as Node });
    this.algorithmService.runAlgorithm();
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
