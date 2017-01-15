import { Component } from '@angular/core';
import { RouteData } from '../../../src/route-data';

@Component({
    template: `<pre>{{data|json}}</pre>`
})
export class JsonComponent {

    constructor(public data: RouteData) {
    }
}
