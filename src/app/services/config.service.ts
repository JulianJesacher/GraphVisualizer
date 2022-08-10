import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Edge } from 'vis';

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

  public configOpenedClick$ : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public get configOpenedClick(){
    return this. configOpenedClick$.value;
  }

  constructor() {}

  public showConfig(configType: ConfigTypes, targetId: number, domXPosition :number, domYPosition: number){
    const newPosition = { x: domXPosition, y: domYPosition };
    this.position$.next(newPosition);

    if (configType === ConfigTypes.NODE) {
      this.nodeConfigVisible$.next(true);
      this.edgeConfigVisible$.next(false);
      this.nodeId$.next(targetId);
    } else if (configType === ConfigTypes.EDGE) {
      this.edgeConfigVisible$.next(true);
      this.nodeConfigVisible$.next(false);
      this.edgeId$.next(targetId);
    }

    this.configOpenedClick$.next(true);
  }
}

export enum ConfigTypes {
  NODE,
  EDGE,
}
