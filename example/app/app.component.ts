import { Component } from '@angular/core';
import { ApiLocation } from 'angular-resource-router';

@Component({
    selector: 'my-app',
    template: `<p>See <a href="http://docs.resourcerouterexample.apiary.io/#">API definition</a></p>

<template [resourceData] let-data [resourceDataOf]="apiLocation.url"
          (urlChange)="apiLocation.url=$event">
    <h1>{{data.url}}</h1>
    <resource-view [data]="data"></resource-view>
</template>

<!-- TODO event not working -->
<!--<div *resourceData="let viewData of apiLocation.url"-->
     <!--(urlChange)="navigate($event)">-->
    <!--<h1>{{viewData.url}}</h1>-->
    <!--<resource-view [data]="viewData"></resource-view>-->
<!--</div>-->
`
})
export class AppComponent {

    constructor(public apiLocation: ApiLocation) {
    }
}
