import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ResourceRouterModule } from '../../public_api';
import { AppComponent } from './app.component';
import { JsonComponent } from './components/json.component';
import { SampleComponent } from './components/sample.component';
import { HttpClientModule } from '@angular/common/http';

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
      prefix: 'https://private-anon-5c8d0c0da6-resourcerouterexample.apiary-mock.com/api/',
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
    FormsModule,
    HttpClientModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
