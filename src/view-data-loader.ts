import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ResourceViewRegistry } from './resource-view-registry';
import { ViewTypeStrategy } from './view-type-strategy';
import { ViewData } from './view-data';
import { ViewDef } from './view-definition';
import { NavigationHandler } from './navigation-handler';


export abstract class ViewDataLoader {

  abstract fetch(url: string, navigation: NavigationHandler): Observable<ViewData<any>>;

}

export abstract class HttpViewDataLoader extends ViewDataLoader {

  constructor(public strategy: ViewTypeStrategy,
              public registry: ResourceViewRegistry) {
    super();
  }

  abstract fetch(url: string, navigation: NavigationHandler): Observable<ViewData<any>>;

  resolve(response: Response, navigation: NavigationHandler): ViewData<any> {
    // Resolve type, if possible
    const type = this.strategy.extractType(response);
    const config = type ? this.registry.match(type, response.status) : null;

    // Parse body
    const body = this.parse(response, config);

    // Return
    return ViewData.fromResponse(navigation, config, type, response, body);
  }

  //noinspection JSMethodCanBeStatic
  protected parse(response: Response, config: ViewDef|null): any {
    // Is it defined by the config?
    if (config && config.body) {
      // Resolve
      let data: any = response[config.body];
      if (typeof data === 'function') {
        data = data.call(response);
      }
      return data;
    }

    return this.parseDefault(response);
  }

  //noinspection JSMethodCanBeStatic
  protected parseDefault(response: Response): any {
    let type = response.headers.get('content-type');
    if (!type) return null;

    // Strip parameters
    type = type.replace(/;.*$/, '');

    // Best-effort parsing
    if (type.match(/\/(.+\+)?json$/)) {
      return response.json();
    } else if (type.match(/^text\//)) {
      return response.text();
    } else if (type === 'application/octet-stream' || type.match(/^image\//)) {
      return response.blob();
    }
  }
}

@Injectable()
export class DefaultHttpViewDataLoader extends HttpViewDataLoader {

  constructor(public http: Http,
              strategy: ViewTypeStrategy,
              registry: ResourceViewRegistry) {
    super(strategy, registry);
  }

  fetch(url: string, navigation: NavigationHandler): Observable<ViewData<any>> {
    // Swallow errors, treat them as normal response
    return this.get(url)
      .catch(response => Observable.of(response))
      .map(response => this.resolve(response, navigation));
  }

  protected get(url: string): Observable<Response> {
    return this.http.get(url);
  }
}
