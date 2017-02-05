import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ResourceViewRegistry } from './resource-view-registry';
import { ResponseTypeStrategy } from './response-type-strategy';
import { ViewData } from './view-data';
import { ViewDef } from './view-definition';
import { NavigationHandler, NULL_NAVIGATION_HANDLER } from './navigation-handler';


export abstract class ViewDataLoader {

    constructor(public strategy: ResponseTypeStrategy,
                public registry: ResourceViewRegistry) {
    }

    abstract fetch(url: string, navigation: NavigationHandler): Observable<ViewData<any>>;

    resolve(response: Response, navigation: NavigationHandler): ViewData<any> {
        // Resolve type
        const type = this.strategy.extractType(response);
        const view = this.registry.match(type);

        // Parse body
        const body = this.parse(response, view);

        // Return
        return new ViewData(navigation || NULL_NAVIGATION_HANDLER, response, type, body, view);
    }

    //noinspection JSMethodCanBeStatic
    protected parse(response: Response, view: ViewDef) {
        // Is it defined by the view?
        if (view.body) {
            // Resolve
            let data: any = response[view.body];
            if (typeof data === 'function') {
                data = data();
            }
            return data;
        }

        return this.parseDefault(response);
    }

    //noinspection JSMethodCanBeStatic
    protected parseDefault(response: Response) {
        let type = response.headers.get('content-type');
        if (!type) return null;

        // Strip parameters
        type = type.replace(/;.*$/, '');

        // Best-effort parsing
        if (type === 'application/json' || type.match(/^application\/.*\+json$/)) {
            return response.json();
        } else if (type.match(/^text\//)) {
            return response.text();
        } else if (type === 'application/octet-stream' || type.match(/^image\//)) {
            return response.blob();
        }
    }
}

@Injectable()
export class HttpViewDataLoader extends ViewDataLoader {

    constructor(private http: Http,
                strategy: ResponseTypeStrategy,
                registry: ResourceViewRegistry) {
        super(strategy, registry);
    }

    fetch(url: string, navigation: NavigationHandler): Observable<ViewData<any>> {
        return this.http
            .get(url)
            .catch(response => Observable.of(response))
            .map(response => this.resolve(response, navigation));
    }
}
