import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-node-selector',
  templateUrl: './node-selector.component.html',
  styleUrls: ['./node-selector.component.css'],
})
export class NodeSelectorComponent implements OnInit {
  public items: MenuItem[] = [];
  activeIndex: number = 1;

  constructor() {}

  ngOnInit(): void {
    this.items = [
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
