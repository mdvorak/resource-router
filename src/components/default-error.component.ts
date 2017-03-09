import { Component } from '@angular/core';
import { ViewData } from '../view-data';

@Component({
    template: `<p>Error loading a view<code *ngIf="data.type"> {{data.type}}</code> on URL <code>{{data.url}}</code>
<p>{{data.status}} {{data.statusText}}</p>
<pre *ngIf="data.body">{{data.body}}</pre>`
})
export class DefaultErrorComponent {

    constructor(public data: ViewData<any>) {
    }
}
