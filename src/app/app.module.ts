import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GraphComponent } from './components/graph-component/graph.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { GraphElementConfigComponent } from './components/graph-element-config/graph-element-config.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    ToolbarComponent,
    GraphElementConfigComponent
  ],
  imports: [BrowserModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
