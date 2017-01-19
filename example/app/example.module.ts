import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ResourceRouterModule } from '../../index';
import { ExampleComponent } from './example.component';
import { JsonComponent } from './components/json.component';

@NgModule({
    declarations: [
        ExampleComponent,
        JsonComponent
    ],
    imports: [
        BrowserModule,
        ResourceRouterModule.configure({
            prefix: 'api/'
        }),
        ResourceRouterModule.forTypes([
            {
                type: 'application/json',
                component: JsonComponent
            }
        ])
    ],
    bootstrap: [
        ExampleComponent
    ]
})
export class ExampleModule {
}
