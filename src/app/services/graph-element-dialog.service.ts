import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Position } from 'vis';
import { GraphElementType } from '../components/graph-element-config/graph-element-config.component';
import { GraphEventService } from './graph-event.service';

@Injectable({
  providedIn: 'root',
})
export class GraphElementDialogService {
  public elementId$ = new BehaviorSubject<string | null>(null);
  public elementType$ = new BehaviorSubject<GraphElementType | null>(null);
  public position$ = new BehaviorSubject<Position | null>(null);
  public initialLabel$ = new BehaviorSubject<string | null>(null);

  constructor(private graphEvents: GraphEventService) {
    this.graphEvents.position$.subscribe((newValue) => this.position$.next(newValue));
    this.graphEvents.elementId$.subscribe((newValue) => this.elementId$.next(newValue));
    this.graphEvents.elementType$.subscribe((newValue) => this.elementType$.next(newValue));
    this.graphEvents.initialLabel$.subscribe((newValue) => this.initialLabel$.next(newValue));
  }
}
