import { Component } from '@angular/core';
import { ActiveViewData } from '../active-view-data';

@Component({
    template: `<p>Missing type definition of <code>"{{route.type}}"</code> on <code>"{{route.url}}"</code></p>
<pre>{{data}}</pre>`
})
export class DefaultMissingRouteDefinitionComponent {

    data: any;

    constructor(public route: ActiveViewData) {
        this.data = route.text();
    }
}
