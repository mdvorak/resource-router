import { Component } from '@angular/core';
import { ActiveViewData } from '../../../src/active-view-data';

@Component({
    template: `<h2>Untyped JSON</h2><pre>{{data|json}}</pre>
<a [apiLink]="data._links?.next?.href">{{data._links?.next?.title}}</a>`
})
export class JsonComponent {

    data: any;

    constructor(data: ActiveViewData) {
        this.data = data.json();
    }
}
