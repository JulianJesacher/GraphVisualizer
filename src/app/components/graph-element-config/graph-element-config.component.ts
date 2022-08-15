import {
  Component,
  ElementRef,
  HostListener,
  Input,
  Output,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Position } from 'vis';

// ToDo: Extract somewhere else

interface GraphElementIdentifier {
  type: GraphElementType;
  id: string;
}

export type GraphElementDeleteEvent = GraphElementIdentifier;

interface UpdatePayload {
  label: string;
}

export interface GraphElementUpdateEvent extends GraphElementIdentifier {
  updatedData: UpdatePayload;
}

export type GraphElementType = 'edge' | 'node';

@Component({
  selector: 'app-graph-element-config',
  templateUrl: './graph-element-config.component.html',
  styleUrls: ['./graph-element-config.component.css']
})
export class GraphElementConfigComponent {
  public nodeConfigForm!: FormGroup;
  public ElementConfigErrorState = ElementConfigErrorState;
  public configErrorState = ElementConfigErrorState.NONE;
  @ViewChild('configContainer', { static: true }) container!: ElementRef<HTMLDivElement>;

  private elementId_?: string | null;
  @Input() set elementId(newElementId: string | undefined | null) {
    this.elementId_ = newElementId;
    this.resetErrors();
  }

  private elementType_?: GraphElementType | null;
  @Input() set elementType(newElementType: GraphElementType | undefined | null) {
    this.elementType_ = newElementType;
    this.resetErrors();
  }

  @Input() set initialLabel(newLabel: string | undefined | null) {
    this.nodeConfigForm = this.fb.group({
      label: this.fb.control(newLabel, [Validators.required]),
    });
    this.resetErrors();
  }

  @Input() set position(newPosition: Position | undefined | null) {
    if (!newPosition) {
      return;
    }
    this.container.nativeElement.style.left = newPosition.x + 'px';
    this.container.nativeElement.style.bottom =
      window.innerHeight - newPosition.y + 'px';
  }

  @Output() delete = new EventEmitter<GraphElementDeleteEvent>();
  @Output() update = new EventEmitter<GraphElementUpdateEvent>();
  @Output() close = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {}

  // HostListener to handle keyboard events to interact with the node
  @HostListener('document:keyup', ['$event'])
  handleKeyBoardEvents(event: KeyboardEvent) {
    const key = event.key;
    switch (key) {
      case 'Delete':
        this.triggerDelete();
        break;
      case 'Escape':
        this.closeConfig();
        break;
      default:
        return;
    }
  }

  triggerDelete() {
    const elementId = this.elementId_;
    const elementType = this.elementType_;
    if (!elementId || !elementType) {
      return;
    }

    this.delete.next({
      id: elementId,
      type: elementType,
    });
  }

  /**
   * Checks provided id and label and shows error if a value is missing or the given id already exists in the graph. If everything is valid, the node is updated.
   */
  triggerUpdate() {
    if (!this.nodeConfigForm.valid) {
      this.configErrorState = ElementConfigErrorState.LABEL_NOT_PROVIDED;
      return;
    }

    const elementId = this.elementId_;
    const elementType = this.elementType_;
    if (!elementId || !elementType) {
      return;
    }

    this.update.next({
      id: elementId,
      type: elementType,
      updatedData: this.nodeConfigForm.value,
    });

    this.closeConfig();
  }

  /**
   * Closes the node config component
   */
  closeConfig() {
    this.resetErrors();
    this.close.next();
  }

  /**
   * Resets error of the config. Triggered, when either one of the input fields is focused or when the config is closed.
   */
  resetErrors() {
    this.configErrorState = ElementConfigErrorState.NONE;
  }
}

enum ElementConfigErrorState {
  NONE = '',
  LABEL_NOT_PROVIDED = 'No label was provided',
}
