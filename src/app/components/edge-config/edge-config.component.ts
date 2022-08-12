import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/services/config.service';
import { GraphDataService } from 'src/app/services/graph-data.service';
import { Edge } from 'vis';

@Component({
  selector: 'app-edge-config',
  templateUrl: './edge-config.component.html',
  styleUrls: ['./edge-config.component.css'],
})
export class EdgeConfigComponent implements OnInit {
  public edgeConfigForm!: FormGroup;
  public configErrorState: EdgeConfigErrorState = EdgeConfigErrorState.NONE;
  public configErrorNone: EdgeConfigErrorState = EdgeConfigErrorState.NONE;
  @ViewChild('configContainer') container!: ElementRef<HTMLDivElement>;
  private edgeToEdit!: Edge;

  @Input() set edgeId(newEdgeId: number) {
    this.edgeToEdit = this.graphData.graphEdges.get(newEdgeId)!;
    this.updateForm();
  }

  private _visible: boolean = false;
  @Input() set visible(newVisibility: boolean | undefined) {
    if (newVisibility === undefined) {
      return;
    }
    if (newVisibility) {
      this.container.nativeElement.style.display = 'block';
    } else {
      this.container.nativeElement.style.display = 'none';
    }
    this._visible = newVisibility;
  }

  @Input() set position(newPosition: { x: number; y: number } | undefined) {
    if (newPosition === undefined) {
      return;
    }
    this.container.nativeElement.style.left = newPosition.x + 'px';
    this.container.nativeElement.style.bottom =
      window.innerHeight - newPosition.y + 'px';
  }

  // HostListener to handle keyboard events to interact with the node
  @HostListener('document:keyup', ['$event'])
  handleKeyBoardEvents(event: KeyboardEvent) {
    // If no edge config is opened, the keyboard event is disregarded
    if(!this._visible){
      return;
    }

    const key = event.key;
    switch(key){
      case 'Delete':
        this.removeEdge();
        break;
      case 'Escape':
        this.closeConfig();
        break;
      default:
        return;
    }
  }

  constructor(private fb: FormBuilder, private graphData: GraphDataService, private configService: ConfigService) {
    this.updateForm();
  }

  ngOnInit(): void {}

  /**
   * Updates the values in the form with the data of the updated edge or with no values, if no edge was provided.
   */
  updateForm() {
    this.edgeConfigForm = this.fb.group({
      id: this.fb.control(this.edgeToEdit?.id ?? null, [Validators.required]),
      label: this.fb.control(this.edgeToEdit?.label ?? null, [
        Validators.required,
      ]),
    });
  }

  /**
   * Checks provided id and label and shows error if a value is missing or the given id already exists in the graph. If everything is valid, the edge is updated.
   */
  updateEdge() {
    if (!this.edgeConfigForm.valid) {
      if (this.edgeConfigForm.value.id === null) {
        this.configErrorState = EdgeConfigErrorState.ID_NOT_PROVIDED;
      } else {
        this.configErrorState = EdgeConfigErrorState.LABEL_NOT_PROVIDED;
      }
      return;
    }

    if (!this.edgeToEdit) {
      return;
    }

    const edgeConfig: Edge = {
      ...this.edgeConfigForm.value,
      from: this.edgeToEdit.from,
      to: this.edgeToEdit.to,
    };
    let idExists: boolean = false;
    this.graphData.graphNodes.forEach((edge) => {
      //New id chosen which is already in the dataset
      if (edgeConfig.id != this.edgeToEdit.id && edgeConfig.id == edge.id) {
        idExists = true;
      }
    });

    if (idExists) {
      this.configErrorState = EdgeConfigErrorState.ID_EXISTS;
      return;
    }

    this.graphData.graphEdges.update(edgeConfig);
    this.closeConfig();
  }

  /**
   * Remove respective edge, if an id was provided. If the edge has been removed, the config gets closed
   */
  removeEdge() {
    if (this.edgeToEdit?.id == undefined) {
      return;
    }
    this.graphData.graphEdges.remove(this.edgeToEdit.id);
    this.closeConfig();
  }

  /**
   * Closes the edge config component
   */
  closeConfig() {
    this.configService.edgeConfigVisible$.next(false);
    this.graphData.graph.selectEdges([]);
    this.resetErrors();
  }

  /**
   * Resets error of the config. Triggered, when either one of the input fields is focused, or when the config is closed.
   */
  resetErrors() {
    this.configErrorState = EdgeConfigErrorState.NONE;
  }
}

enum EdgeConfigErrorState {
  NONE = '',
  ID_EXISTS = 'An edge with this id already exists',
  ID_NOT_PROVIDED = 'No id was provided',
  LABEL_NOT_PROVIDED = 'No label was provided',
}
