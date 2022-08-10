import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { ConfigService, ConfigTypes } from 'src/app/services/config.service';
import { Edge, Network, Node } from 'vis';
import { GraphDataService } from '../../services/graph-data.service';
import { EdgeConfigComponent } from '../edge-config/edge-config.component';
import { NodeConfigComponent } from '../node-config/node-config.component';

@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.css'],
})
export class GraphComponentComponent implements AfterViewInit {
  @ViewChild('graphContainer') graphContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('edgeConfig') edgeConfigElement!: EdgeConfigComponent;
  @ViewChild('nodeConfig') nodeConfigElement!: NodeConfigComponent;

  private configOpenedClick: boolean = false;

  // HostListener to close config element if a click outside occured
  @HostListener('document:click', ['$event'])
  closeConfigs(event: MouseEvent) {
    let configContainer: undefined | EdgeConfigComponent | NodeConfigComponent =
      undefined;
    if (
      this.configService.edgeConfigVisible &&
      !this.configService.nodeConfigVisible
    ) {
      configContainer = this.edgeConfigElement;
    } else if (
      !this.configService.edgeConfigVisible &&
      this.configService.nodeConfigVisible
    ) {
      configContainer = this.nodeConfigElement;
    }

    // Return if no configContainer was selected or if viewchilds are not yet initialized, or if the config is not yet displayed (click to open the config)
    if (configContainer === undefined || this.configOpenedClick) {
      this.configOpenedClick = false;
      return;
    }

    if (
      event.target instanceof Node &&
      !this.edgeConfigElement.container.nativeElement.contains(event.target)
    ) {
      this.configService.edgeConfigVisible$.next(false);
      this.configService.nodeConfigVisible$.next(false);
    }
    this.configOpenedClick = false;
  }

  constructor(
    private graphData: GraphDataService,
    public configService: ConfigService
  ) {}

  ngAfterViewInit() {
    const container = this.graphContainer.nativeElement;
    const data = {
      nodes: this.graphData.graphNodes,
      edges: this.graphData.graphEdges,
    };
    this.graphData.graph = new Network(container, data, this.graphData.graphOptions);

    this.graphData.graph.on('selectNode', (event) => {
      this.configService.showConfig(ConfigTypes.NODE, event);
      this.configOpenedClick = true;
    });

    this.graphData.graph.on('selectEdge', (event) => {
      this.configService.showConfig(ConfigTypes.EDGE, event);
      this.configOpenedClick = true;
    });
  }
}
