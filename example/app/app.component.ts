import { Component } from '@angular/core';
import { ApiLocation } from 'angular-resource-router';

@Component({
    selector: 'example-app',
    template: `<resource-outlet [(src)]="apiLocation.url"></resource-outlet>`
})
export class AppComponent {

    constructor(public apiLocation: ApiLocation) {
    }
}
