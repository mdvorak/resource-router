import { Headers, Response } from '@angular/http';
import { ViewDef } from './view-definition';
import { NavigationHandler } from './navigation-handler';


export class ViewData<T> {

  static fromResponse<T>(navigation: NavigationHandler,
                         config: ViewDef | null,
                         type: string | null,
                         response: Response,
                         body?: T): ViewData<T> {
    return new ViewData<T>(
      navigation,
      config,
      type,
      response.url,
      response.status,
      response.statusText,
      response.headers,
      body
    );
  }

  constructor(public readonly navigation: NavigationHandler,
              public readonly config: ViewDef | null,
              public readonly type: string | null,
              public readonly url: string,
              public readonly status: number,
              public readonly statusText: string | null,
              public readonly headers: Headers | null,
              public readonly body?: T) {
    if (!navigation) {
      throw new Error('navigation handler is mandatory');
    }
  }
}
