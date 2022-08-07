import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Node } from 'vis';
import { GraphDataService } from '../../services/graph-data.service';

@Component({
  selector: 'app-node-config',
  templateUrl: './node-config.component.html',
  styleUrls: ['./node-config.component.css'],
})
export class NodeConfigComponent implements OnInit {
  public nodeConfigForm: FormGroup;
  public configErrorState: NodeConfigErrorState = NodeConfigErrorState.NONE;
  @Input() nodeToEdit: Node = { id: -1, label: 'new' };

  constructor(private fb: FormBuilder, private graphData: GraphDataService) {
    this.nodeConfigForm = this.fb.group({
      id: this.fb.control(null, [Validators.required]),
      label: this.fb.control(null, [Validators.required]),
    });
  }

  ngOnInit(): void {}

  updateNode() {
    if (!this.nodeConfigForm.valid) {
      if (this.nodeConfigForm.value.id === null) {
        this.configErrorState = NodeConfigErrorState.ID_NOT_PROVIDED;
      } else {
        this.configErrorState = NodeConfigErrorState.LABEL_NOT_PROVIDED;
      }
      return;
    }

    const nodeConfig: Node = this.nodeConfigForm.value;
    let idExists: boolean = false;
    this.graphData.graphNodes.forEach((node) => {
      console.log(
        node.id,
        this.nodeToEdit.id,
        nodeConfig.id != this.nodeToEdit.id,
        nodeConfig.id == node.id
      );
      //New id chosen which is already in the dataset
      if (nodeConfig.id != this.nodeToEdit.id && nodeConfig.id == node.id) {
        idExists = true;
      }
    });

    if (idExists) {
      this.configErrorState = NodeConfigErrorState.ID_EXISTS;
      return;
    }

    this.graphData.graphNodes.add({
      id: nodeConfig.id,
      label: nodeConfig.label,
    });
  }

  deleteNode() {
    if (this.nodeToEdit?.id == undefined) {
      return;
    }
    this.graphData.graphNodes.remove(this.nodeToEdit.id);
  }
}

enum NodeConfigErrorState {
  NONE = '',
  ID_EXISTS = 'A node with this id already exists',
  ID_NOT_PROVIDED = 'No id was provided',
  LABEL_NOT_PROVIDED = 'No label was provided',
}
