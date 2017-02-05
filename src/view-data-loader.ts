import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { ResourceViewRegistry } from './resource-view-registry';
import { ResponseTypeStrategy } from './response-type-strategy';
import { ViewData } from './view-data';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


export abstract class ViewDataLoader {

    abstract fetch(url: string): Observable<ViewData>;

}

@Injectable()
export class HttpViewDataLoader extends ViewDataLoader {

    constructor(private http: Http,
                private strategy: ResponseTypeStrategy,
                private registry: ResourceViewRegistry) {
        super();
    }

    fetch(url: string): Observable<ViewData> {
        return this.http
            .get(url)
            // TODO .catch((err, response) => response)
            .map(response => this.resolve(response));
    }

    private resolve(response: Response): ViewData {
        const type = this.strategy.extractType(response);
        const route = this.registry.match(type);

        return new ViewData(response, type, route);
    }
}
