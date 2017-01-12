import {Component} from "@angular/core";
import {RouteData} from "../route-data";

@Component({
    template: `<p>Missing type definition of <code>"{{route.type}}"</code> on <code>"{{route.url}}"</code></p>
<pre>{{data}}</pre>`
})
export class DefaultMissingRouteDefinitionComponent {

    data: any;

    constructor(public route: RouteData) {
        this.data = route.text();
    }
}
