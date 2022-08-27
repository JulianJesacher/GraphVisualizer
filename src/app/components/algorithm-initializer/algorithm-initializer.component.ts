import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { InitializationInformation, inputNodesInitializationInformation } from 'src/app/types/algorithm-intializer-dialog.types';
import { AlgorithmGroup } from '../../types/algorithm.types';
import { UpdateCurrentNodeSelectionEvent } from '../../types/algorithm-intializer-dialog.types';

@Component({
  selector: 'app-algorithm-initializer',
  templateUrl: './algorithm-initializer.component.html',
  styleUrls: ['./algorithm-initializer.component.css'],
})
export class AlgorithmInitializerComponent implements OnInit {
  public requiredSteps: MenuItem[] = [];
  public activeIndex: number = 1;

  private _initializationInformation?: InitializationInformation[];
  private _algorithmGroup?: AlgorithmGroup;
  @Input() set algorithmGroup(newGroup: AlgorithmGroup | null) {
    if (!newGroup) {
      return;
    }
    this._algorithmGroup = newGroup;
    this._initializationInformation = inputNodesInitializationInformation[newGroup];
    this.updateSteps();
  }

  @Output() updateCurrentNodeSelection = new EventEmitter<UpdateCurrentNodeSelectionEvent>();

  constructor() {}

  ngOnInit(): void {}

  updateSteps() {
    if (!this._algorithmGroup) {
      throw new Error('No algorithm group (traversal, apsp, spsp, sssp) was selected!');
    }
    if (!this._initializationInformation) {
      throw new Error('No information about the initializatio process for the selected algorithm available!');
    }

    this.requiredSteps = this._initializationInformation.map((nodeInformation, index) => {
      return {
        label: nodeInformation.nodeName,
        command: (event: any) => this.handleStepClick(index),
        fullInformation: nodeInformation,
      };
    });
    this.activeIndex = 0;
    const firstStep = this.requiredSteps[0];
    this.triggerUpdate(firstStep);
  }

  handleStepClick(index: number) {
    const currentStep = this.requiredSteps[this.activeIndex];
    this.activeIndex++;
    this.triggerUpdate(currentStep);
  }

  triggerUpdate(newNodeSelection: MenuItem) {
    this.updateCurrentNodeSelection.next({
      //@ts-ignore
      nodeType: newNodeSelection.fullInformation.nodeType,
      //@ts-ignore
      color: newNodeSelection.fullInformation.color,
    });
  }
}
