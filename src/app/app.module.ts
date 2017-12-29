import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ResourceRouterModule } from '../lib/public_api';
import { AppComponent } from './app.component';
import { JsonComponent } from './components/json.component';
import { SampleComponent } from './components/sample.component';
import { HttpClientModule } from '@angular/common/http';
import { environment } from './environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    JsonComponent,
    SampleComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ResourceRouterModule.configure({
      prefix: environment.prefix,
      useHash: environment.useHash
    }),
    ResourceRouterModule.forTypes([
      {
        type: 'application/x.questions',
        component: JsonComponent
      },
      {
        type: 'application/x.sample',
        component: SampleComponent
      }
    ])
  ],
  exports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
