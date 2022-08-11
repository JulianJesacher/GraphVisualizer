import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Node } from 'vis';
import { GraphDataService } from '../../services/graph-data.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-node-config',
  templateUrl: './node-config.component.html',
  styleUrls: ['./node-config.component.css'],
})
export class NodeConfigComponent implements OnInit {
  public nodeConfigForm!: FormGroup;
  public configErrorState: NodeConfigErrorState = NodeConfigErrorState.NONE;
  public configErrorNone: NodeConfigErrorState = NodeConfigErrorState.NONE;
  @ViewChild('configContainer') container!: ElementRef<HTMLDivElement>;
  private nodeToEdit!: Node;

  @Input() set nodeId(newNodeId: number) {
    this.nodeToEdit = this.graphData.graphNodes.get(newNodeId)!;
    this.updateForm();
  }

  private _visible: boolean = false;
  @Input() set visible(newVisibility: boolean | undefined) {
    if (newVisibility === undefined) {
      return;
    }
    if (newVisibility) {
      this.container.nativeElement.style.display = 'inline-block';
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
    // If no node config is opened, the keyboard event is disregarded
    if (!this._visible) {
      return;
    }

    const key = event.key;
    console.log(event);
    switch (key) {
      case 'Delete':
      case 'Backspace':
        this.removeNode();
        break;
      default:
        return;
    }
  }

  constructor(
    private fb: FormBuilder,
    private graphData: GraphDataService,
    private configService: ConfigService
  ) {
    this.updateForm();
  }

  ngOnInit(): void {}

  /**
   * Updates the values in the form with the data of the updated edge or with no values, if no edge was provided
   */
  updateForm() {
    this.nodeConfigForm = this.fb.group({
      id: this.fb.control(this.nodeToEdit?.id ?? null, [Validators.required]),
      label: this.fb.control(this.nodeToEdit?.label ?? null, [
        Validators.required,
      ]),
    });
  }

  /**
   * Checks provided id and label and shows error if a value is missing or the given id already exists in the graph. If everything is valid, the node is updated.
   */
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
      //New id chosen which is already in the dataset
      if (nodeConfig.id != this.nodeToEdit.id && nodeConfig.id == node.id) {
        idExists = true;
      }
    });

    if (idExists) {
      this.configErrorState = NodeConfigErrorState.ID_EXISTS;
      return;
    }

    this.graphData.graphNodes.update(nodeConfig);
    this.closeConfig();
  }

  /**
   * Remove respective node, if an id was provided. This function also removes all edges that are incident with this node. If the node has been removed, the config gets closed
   */
  removeNode() {
    if (this.nodeToEdit?.id == undefined) {
      return;
    }
    this.graphData.graphNodes.remove(this.nodeToEdit.id);
    this.closeConfig();
  }

  /**
   * Closes the node config component
   */
  closeConfig() {
    this.configService.nodeConfigVisible$.next(false);
    this.graphData.graph.selectNodes([]);
  }

  /**
   * Resets error of the config. Triggered, when either one of the input fields is focused.
   */
  resetErrors() {
    this.configErrorState = NodeConfigErrorState.NONE;
  }
}

enum NodeConfigErrorState {
  NONE = '',
  ID_EXISTS = 'A node with this id already exists',
  ID_NOT_PROVIDED = 'No id was provided',
  LABEL_NOT_PROVIDED = 'No label was provided',
}
