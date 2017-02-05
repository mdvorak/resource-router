import { Component } from '@angular/core';
import { ApiLocation } from 'angular-resource-router';

@Component({
    selector: 'my-app',
    template: `<p>See <a href="https://app.swaggerhub.com/api/mdvorak/resource-router-example/1.0.0">API definition</a></p>

<div *resourceData="let viewData of apiLocation.url"
     (resourceUrlChange)="apiLocation.url=$event">
    <h1>{{viewData.url}}</h1>
    <resource-view [data]="viewData"></resource-view>
</div>`
})
export class AppComponent {

    constructor(public apiLocation: ApiLocation) {
    }
}
