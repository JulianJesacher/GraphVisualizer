import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { GraphComponent } from './components/graph-component/graph.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { GraphElementConfigComponent } from './components/graph-element-config/graph-element-config.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NodeSelectorComponent } from './components/node-selector/node-selector.component';

import { CardModule } from 'primeng/card';
import { StepsModule } from 'primeng/steps';

@NgModule({
  declarations: [AppComponent, GraphComponent, ToolbarComponent, GraphElementConfigComponent, NodeSelectorComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CardModule,
    StepsModule,
    RouterModule.forRoot([{ path: '', component: AppComponent }]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
