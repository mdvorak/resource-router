import { Component } from '@angular/core';
import { ApiLocation } from 'angular-resource-router';

@Component({
    selector: 'my-app',
    template: `See <a href="https://app.swaggerhub.com/api/mdvorak/resource-router-example/1.0.0">API definition</a>

<!--<resource-outlet [(src)]="apiLocation.url"></resource-outlet>-->


<resource-view *resourceData="let x of apiLocation.url"
               (resourceUrlChange)="apiLocation.url=$event"
               [data]="x">
    Foo {{x.response}}
</resource-view>

<!--<template [resourceData] let-data [resourceDataOf]="apiLocation.url">-->
    <!--<resource-view [data]="data"></resource-view>-->
<!--</template>-->
`
})
export class AppComponent {

    constructor(public apiLocation: ApiLocation) {
    }
}
