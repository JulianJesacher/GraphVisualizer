import { Component, ElementRef, HostListener, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GraphElementDeleteEvent, GraphElementType, GraphElementUpdateEvent } from 'src/app/types/element-config-dialog.types';
import { Position } from 'vis';

@Component({
  selector: 'app-graph-element-config',
  templateUrl: './graph-element-config.component.html',
  styleUrls: ['./graph-element-config.component.css'],
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
    this.container.nativeElement.style.bottom = window.innerHeight - newPosition.y + 'px';
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

  /**
   * Deletes element if id and type are provided
   */
  triggerDelete() {
    const elementId = this.elementId_;
    const elementType = this.elementType_;
    if (elementId === undefined || elementId === null || !elementType) {
      return;
    }

    this.delete.next({
      id: elementId,
      type: elementType,
    });
  }

  /**
   * Checks provided label and shows error if the label is missing. If everything is valid, the element gets updated and the dialog closed.
   */
  triggerUpdate() {
    if (!this.nodeConfigForm.valid) {
      this.configErrorState = ElementConfigErrorState.LABEL_NOT_PROVIDED;
      return;
    }

    const elementId = this.elementId_;
    const elementType = this.elementType_;
    if ((!elementId && elementId != '0') || !elementType) {
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
   * Closes the config dialog
   */
  closeConfig() {
    if (!this.nodeConfigForm.valid) {
      this.triggerDelete();
    }
    this.resetErrors();
    this.close.next();
  }

  /**
   * Resets error of the config. Triggered, when the input field is focused or when the config dialog is closed.
   */
  resetErrors() {
    this.configErrorState = ElementConfigErrorState.NONE;
  }
}

enum ElementConfigErrorState {
  NONE = '',
  LABEL_NOT_PROVIDED = 'No label was provided',
}
