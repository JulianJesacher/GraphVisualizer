import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GraphComponentComponent } from './components/graph-component/graph-component.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { NodeConfigComponent } from './components/node-config/node-config.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    GraphComponentComponent,
    ToolbarComponent,
    NodeConfigComponent,
  ],
  imports: [BrowserModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
