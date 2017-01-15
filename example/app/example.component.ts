import { Component } from '@angular/core';
import { ApiLocation } from '../../index';

@Component({
    selector: 'example-app',
    template: `<resource-outlet [(src)]="apiLocation.url"></resource-outlet>`
})
export class ExampleComponent {

    constructor(public apiLocation: ApiLocation) {
    }
}
