import { Injectable, Type } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { RouteRegistry } from './route-registry';
import { ResponseTypeStrategy } from './response-type-strategy';
import { RouteDef, Data, ResolveData } from './config';
import 'rxjs/add/operator/map';


export class LoadedRouteData {

    component: Type<any>;
    data?: Data; // TODO not supported yet
    resolve?: ResolveData; // TODO not supported yet

    constructor(public response: Response,
                public  type: string,
                route: RouteDef) {
        this.component = route.component;
        this.data = route.data;
        this.resolve = route.resolve;
    }
}


export abstract class RouteDataLoader {

    abstract fetch(url: string): Observable<LoadedRouteData>;

}

@Injectable()
export class HttpRouteDataLoader extends RouteDataLoader {
    constructor(private http: Http,
                private strategy: ResponseTypeStrategy,
                private registry: RouteRegistry) {
        super();
    }

    fetch(url: string): Observable<LoadedRouteData> {
        return this.http
            .get(url)
            .map(response => this.resolve(response));
    }

    private resolve(response: Response): LoadedRouteData {
        const type = this.strategy.extractType(response);
        const route = this.registry.match(type);

        return new LoadedRouteData(response, type, route);
    }
}
