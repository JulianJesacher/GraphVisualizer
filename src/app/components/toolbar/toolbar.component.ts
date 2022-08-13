import { Component, OnInit } from '@angular/core';
import { NodePainter } from 'src/app/graphHelpers/nodePainter';
import { GraphDataService } from 'src/app/services/graph-data.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private graphData : GraphDataService) { }

  ngOnInit(): void {
  }

  addNode(){
      this.graphData.addNode();
  }

  addEdge(){
    this.graphData.addEdge();
  }
}
