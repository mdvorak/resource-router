import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { ResourceRouterModule } from '../../index';
import { ExampleComponent } from './example.component';
import { JsonComponent } from './components/json.component';
import { SampleComponent } from './components/sample.component';

@NgModule({
    declarations: [
        ExampleComponent,
        JsonComponent,
        SampleComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ResourceRouterModule.configure({
            prefix: 'api/'
        }),
        ResourceRouterModule.forTypes([
            {
                type: 'application/json',
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
        ExampleComponent
    ]
})
export class ExampleModule {
}
