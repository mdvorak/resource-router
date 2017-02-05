import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ResourceViewRegistry } from './resource-view-registry';
import { ResponseTypeStrategy } from './response-type-strategy';
import { ViewData } from './view-data';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


export abstract class ViewDataLoader {

    constructor(public strategy: ResponseTypeStrategy,
                public registry: ResourceViewRegistry) {
    }

    abstract fetch(url: string): Observable<ViewData>;

    resolve(response: Response): ViewData {
        const type = this.strategy.extractType(response);
        const route = this.registry.match(type);

        return new ViewData(response, type, route);
    }
}

@Injectable()
export class HttpViewDataLoader extends ViewDataLoader {

    constructor(private http: Http,
                strategy: ResponseTypeStrategy,
                registry: ResourceViewRegistry) {
        super(strategy, registry);
    }

    fetch(url: string): Observable<ViewData> {
        return this.http
            .get(url)
            .catch(response => Observable.of(response))
            .map(response => this.resolve(response));
    }
}
