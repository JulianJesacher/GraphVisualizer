import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { InitializationInformation, inputNodesInitializationInformation } from 'src/app/types/algorithm-intializer-dialog.types';
import { AlgorithmGroup } from '../../types/algorithm.types';
import { UpdateCurrentNodeSelectionEvent, SelectedNodeInformation } from '../../types/algorithm-intializer-dialog.types';
import { nodeColorOptions } from '../../graphConfig/colorConfig';

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

  @Input() selectedNodesInformation: SelectedNodeInformation[] | null = [];

  @Output() updateCurrentNodeSelection = new EventEmitter<UpdateCurrentNodeSelectionEvent>();
  @Output() confirmInputData = new EventEmitter<void>();

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
        command: (event: any) => (this.activeIndex = index),
        fullInformation: nodeInformation,
      };
    });
    this.activeIndex = 0;
    const firstStep = this.requiredSteps[0];
    this.triggerNodeUpdate(firstStep);
  }

  triggerNodeUpdate(newNodeSelection: MenuItemWithInitializationInformation) {
    this.updateCurrentNodeSelection.next({
      nodeType: newNodeSelection.fullInformation.nodeType,
      color: newNodeSelection.fullInformation.color,
      nodeStepIndex: this.activeIndex,
    });
  }

  triggerConfirmInputData() {
    //TODO: Check for validity
    this.confirmInputData.next();
  }

  getNodeName(index: number) {
    if (!this._initializationInformation) {
      throw new Error('No initialization information available!');
    }
    return this._initializationInformation[index].nodeName;
  }
}
