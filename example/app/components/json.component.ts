import { Component } from '@angular/core';
import { RouteData } from '../../../src/route-data';

@Component({
    template: `<pre>{{data|json}}</pre>`
})
export class JsonComponent {

    data: any;

    constructor(data: RouteData) {
        this.data = data.json();
    }
}
