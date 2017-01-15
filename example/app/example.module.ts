import { NgModule } from '@angular/core';
import { ResourceRouterModule } from '../../src/router-module';
import { ExampleComponent } from './example.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    declarations: [
        ExampleComponent
    ],
    imports: [
        BrowserModule,
        ResourceRouterModule.configure({
            prefix: 'asdaa'
        })
    ],
    bootstrap: [
        ExampleComponent
    ]
})
export class ExampleModule {

}
