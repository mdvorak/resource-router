import { Component } from '@angular/core';
import { ActiveViewData } from '../../../src/active-view-data';

@Component({
    template: `<pre>{{data|json}}</pre>`
})
export class JsonComponent {

    data: any;

    constructor(data: ActiveViewData) {
        this.data = data.json();
    }
}
