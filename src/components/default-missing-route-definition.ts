import { Component } from '@angular/core';
import { ViewData } from '../view-data';

@Component({
    template: `<p>Missing type definition of <code>"{{data.type}}"</code> on <code>"{{data.url}}"</code></p>
<pre>{{data.body}}</pre>`
})
export class DefaultMissingRouteDefinitionComponent {

    constructor(public data: ViewData<any>) {
    }
}
