import { Component } from '@angular/core';
import { ViewData } from 'angular-resource-router';

@Component({
    template: `<h2>Untyped JSON</h2><pre>{{data.body|json}}</pre>
<a [apiLink]="data.body._links?.next?.href">{{data.body._links?.next?.title}}</a>`
})
export class JsonComponent {

    constructor(public data: ViewData<any>) {
    }
}
