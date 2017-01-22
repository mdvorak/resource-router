import { Component } from '@angular/core';
import { ApiLocation } from 'angular-resource-router';

@Component({
    selector: 'my-app',
    template: `See <a href="https://app.swaggerhub.com/api/mdvorak/resource-router-example/1.0.0">API definition</a>

<resource-outlet [(src)]="apiLocation.url"></resource-outlet>`
})
export class AppComponent {

    constructor(public apiLocation: ApiLocation) {
    }
}
