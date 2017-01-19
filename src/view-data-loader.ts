import { Injectable, Type } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { ResourceViewRegistry } from './resource-view-registry';
import { ResponseTypeStrategy } from './response-type-strategy';
import { ViewDef, Data, ResolveData } from './config';
import 'rxjs/add/operator/map';


export class LoadedViewData {

    component: Type<any>;
    data?: Data; // TODO not supported yet
    resolve?: ResolveData; // TODO not supported yet

    constructor(public response: Response,
                public  type: string,
                route: ViewDef) {
        this.component = route.component;
        this.data = route.data;
        this.resolve = route.resolve;
    }
}


export abstract class ViewDataLoader {

    abstract fetch(url: string): Observable<LoadedViewData>;

}

@Injectable()
export class HttpViewDataLoader extends ViewDataLoader {
    constructor(private http: Http,
                private strategy: ResponseTypeStrategy,
                private registry: ResourceViewRegistry) {
        super();
    }

    fetch(url: string): Observable<LoadedViewData> {
        return this.http
            .get(url)
            .map(response => this.resolve(response));
    }

    private resolve(response: Response): LoadedViewData {
        const type = this.strategy.extractType(response);
        const route = this.registry.match(type);

        return new LoadedViewData(response, type, route);
    }
}
