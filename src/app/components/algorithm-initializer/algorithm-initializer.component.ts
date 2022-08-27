import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AlgorithmGroup } from '../../types/algorithm.types';

@Component({
  selector: 'app-algorithm-initializer',
  templateUrl: './algorithm-initializer.component.html',
  styleUrls: ['./algorithm-initializer.component.css'],
})
export class AlgorithmInitializerComponent implements OnInit {
  public requiredSteps: MenuItem[] = [];
  public activeIndex: number = 1;

  private _algorithmGroup?: AlgorithmGroup;
  @Input() set algorithmGroup(newGroup: AlgorithmGroup | null) {
  }

  constructor() {}

  ngOnInit(): void {
    this.requiredSteps = [
      {
        label: 'Personal',
        command: (event: any) => {
          this.activeIndex = 0;
          console.log({ severity: 'info', summary: 'First Step', detail: event.item.label });
        },
      },
      {
        label: 'Seat',
        command: (event: any) => {
          this.activeIndex = 1;
          console.log({ severity: 'info', summary: 'Seat Selection', detail: event.item.label });
        },
      },
      {
        label: 'Payment',
        command: (event: any) => {
          this.activeIndex = 2;
          console.log({ severity: 'info', summary: 'Pay with CC', detail: event.item.label });
        },
      },
      {
        label: 'Confirmation',
        command: (event: any) => {
          this.activeIndex = 3;
          console.log({ severity: 'info', summary: 'Last Step', detail: event.item.label });
        },
      },
    ];
  }
}
