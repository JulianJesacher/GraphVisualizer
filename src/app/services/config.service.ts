import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public edgeConfigVisible$: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(undefined);
  public nodeConfigVisible$: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(undefined);
  public get edgeConfigVisible() {
    return this.edgeConfigVisible$.value;
  }
  public get nodeConfigVisible() {
    return this.nodeConfigVisible$.value;
  }

  public edgeId$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  public nodeId$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  public get edgeId() {
    return this.edgeId$.value;
  }
  public get nodeId() {
    return this.nodeId$.value;
  }

  public position$: BehaviorSubject<{ x: number; y: number } | undefined> = new BehaviorSubject<{ x: number; y: number } | undefined>(undefined);
  public get position() {
    return this.position$.value;
  }

  constructor() {}
}
