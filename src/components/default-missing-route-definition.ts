import { Component } from '@angular/core';
import { ViewData } from '../view-data';

@Component({
    template: `<p>Missing type definition of <code>"{{route.type}}"</code> on <code>"{{route.url}}"</code></p>
<pre>{{text}}</pre>`
})
export class DefaultMissingRouteDefinitionComponent {

    text: any;

    constructor(public data: ViewData) {
        this.text = data.response.text();
    }
}
