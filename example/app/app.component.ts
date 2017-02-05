import { Component } from '@angular/core';
import { ApiLocation } from 'angular-resource-router';

@Component({
    selector: 'my-app',
    template: `<p>See <a href="http://docs.resourcerouterexample.apiary.io/#">API definition</a></p>

<!--<template [resourceData] let-viewData [resourceDataOf]="apiLocation.url"-->
          <!--(resourceUrlChange)="navigate($event)">-->
    <!--<h1>{{viewData.url}}</h1>-->
    <!--<resource-view [data]="viewData"></resource-view>-->
<!--</template>-->

<div *resourceData="let viewData of apiLocation.url"
     (resourceUrlChange)="navigate($event)">
    <h1>{{viewData.url}}</h1>
    <resource-view [data]="viewData"></resource-view>
</div>
`
})
export class AppComponent {

    constructor(public apiLocation: ApiLocation) {
    }

    navigate(url: string) {
        this.apiLocation.url = url;
    }
}
