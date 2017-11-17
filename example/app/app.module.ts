import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ResourceRouterModule } from '../../public_api';
import { AppComponent } from './app.component';
import { JsonComponent } from './components/json.component';
import { SampleComponent } from './components/sample.component';

@NgModule({
  declarations: [
    AppComponent,
    JsonComponent,
    SampleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ResourceRouterModule.configure({
      prefix: 'https://private-d3b165-resourcerouterexample.apiary-mock.com/api/',
      useHash: true
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
    FormsModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
