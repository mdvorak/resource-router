import { Response, Headers } from '@angular/http';
import { ViewDef } from './view-definition';
import { NavigationHandler } from './navigation-handler';
import { Type } from '@angular/core';


export class ViewData<T> {

    static fromResponse<T>(navigation: NavigationHandler,
                           config: ViewDef,
                           type: string,
                           response: Response,
                           body: T): ViewData<T> {
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
                public readonly config: ViewDef,
                public readonly type: string,
                public readonly url: string,
                public readonly status: number,
                public readonly statusText: string,
                public readonly headers: Headers,
                public readonly body: T) {
    }
}
