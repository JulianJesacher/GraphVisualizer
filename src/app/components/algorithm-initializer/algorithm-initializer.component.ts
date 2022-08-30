import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { InitializationInformation, inputNodesInitializationInformation } from 'src/app/types/algorithm-intializer-dialog.types';
import { AlgorithmGroup } from '../../types/algorithm.types';
import { UpdateCurrentNodeSelectionEvent, SelectedNodeInformation } from '../../types/algorithm-intializer-dialog.types';
import { nodeColorOptions } from '../../graphConfig/colorConfig';
import { Steps } from 'primeng/steps';

interface MenuItemWithInitializationInformation extends MenuItem {
  fullInformation: InitializationInformation;
}

@Component({
  selector: 'app-algorithm-initializer',
  templateUrl: './algorithm-initializer.component.html',
  styleUrls: ['./algorithm-initializer.component.css'],
})
export class AlgorithmInitializerComponent implements OnInit {
  public requiredSteps: MenuItemWithInitializationInformation[] = [];
  public activeIndex: number = 1;
  public nodeColorOptions = nodeColorOptions;

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

  public _selectedNodesInformation: SelectedNodeInformation[] = [];
  @Input() set selectedNodesInformation(newInformation: SelectedNodeInformation[] | null) {
    if (!newInformation) {
      return;
    }
    this._selectedNodesInformation = newInformation;
    if (this._selectedNodesInformation.length === this.requiredSteps.length) {
      this.confirmButtonDisabled = false;
    }
  }

  @ViewChild('stepsContainer') stepsContainer!: ElementRef<Steps>;

  @Output() updateCurrentNodeSelection = new EventEmitter<UpdateCurrentNodeSelectionEvent>();
  @Output() confirmInputData = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  public confirmButtonDisabled = true;
  public backButtonVisible = false;
  public nextButtonVisible = false;
  public confirmButtonVisible = false;

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
        command: (event: any) => this.stepChanged(index),
        fullInformation: nodeInformation,
      };
    });

    this.confirmButtonDisabled = true;
    this.stepChanged(0);
  }

  stepChanged(index: number) {
    this.activeIndex = index;
    this.backButtonVisible = this.activeIndex === 0 ? false : true;
    this.nextButtonVisible = this.activeIndex != this.requiredSteps.length - 1 ? true : false;
    this.confirmButtonVisible = !this.nextButtonVisible;
    this.triggerNodeUpdate(this.requiredSteps[this.activeIndex]);
  }

  triggerNodeUpdate(newNodeSelection: MenuItemWithInitializationInformation) {
    this.updateCurrentNodeSelection.next({
      nodeType: newNodeSelection.fullInformation.nodeType,
      color: newNodeSelection.fullInformation.color,
      nodeStepIndex: this.activeIndex,
    });
  }

  triggerConfirmInputData() {
    if (this._selectedNodesInformation.length === this.requiredSteps.length) {
      this.confirmInputData.next();
    }
  }

  getNodeName(index: number) {
    if (!this._initializationInformation) {
      throw new Error('No initialization information available!');
    }
    return this._initializationInformation[index].nodeName;
  }

  closeInitializingDialog() {
    this.close.next();
  }

  previousStep() {
    if (this.activeIndex <= 0) {
      throw new Error('Can not decrement the index any further, because the first step is already active!');
    }
    this.activeIndex--;
    this.stepChanged(this.activeIndex);
  }

  nextStep() {
    if (this.activeIndex >= this.requiredSteps.length - 1) {
      throw new Error('Can not increment the index any further, because the last step is already active!');
    }
    this.activeIndex++;
    this.stepChanged(this.activeIndex);
  }
}
