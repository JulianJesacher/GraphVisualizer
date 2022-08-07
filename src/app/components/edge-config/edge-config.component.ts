import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GraphDataService } from 'src/app/services/graph-data.service';
import { Edge } from 'vis';

@Component({
  selector: 'app-edge-config',
  templateUrl: './edge-config.component.html',
  styleUrls: ['./edge-config.component.css'],
})
export class EdgeConfigComponent implements OnInit {
  public edgeConfigForm: FormGroup;
  public configErrorState: EdgeConfigErrorState = EdgeConfigErrorState.NONE;
  @Input() edgeToEdit: Edge = { id: 0, label: 'new', from: 0, to: 0 };

  constructor(private fb: FormBuilder, private graphData: GraphDataService) {
    this.edgeConfigForm = this.fb.group({
      id: this.fb.control(null, [Validators.required]),
      label: this.fb.control(null, [Validators.required]),
    });
  }

  ngOnInit(): void {}

  /**
   * Remove respective edge, if an id was provided.
   */
  removeEdge() {
    if (this.edgeToEdit?.id == undefined) {
      return;
    }
    this.graphData.graphEdges.remove(this.edgeToEdit.id);
  }
}

enum EdgeConfigErrorState {
  NONE = '',
  ID_EXISTS = 'An edge with this id already exists',
  ID_NOT_PROVIDED = 'No id was provided',
  LABEL_NOT_PROVIDED = 'No label was provided',
}
