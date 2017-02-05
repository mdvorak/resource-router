import { Response, Headers } from '@angular/http';
import { Type } from '@angular/core';
import { ViewDef } from './view-definition';
import { NavigationHandler } from './navigation-handler';

export class ViewData<T> {

    readonly component: Type<any>;

    get status(): number {
        return this.response ? this.response.status : 0;
    }

    get statusText(): string {
        return this.response ? this.response.statusText : null;
    }

    get headers(): Headers {
        return this.response ? this.response.headers : null;
    }

    get url(): string {
        return this.response ? this.response.url : null;
    }

    constructor(public readonly navigation: NavigationHandler,
                public readonly response: Response,
                public readonly type: string,
                public readonly body: T,
                view: ViewDef) {
        this.component = view ? view.component : null;
    }

    toString(): string {
        if (this.response) {
            return this.response.toString() + ' as ' + this.component;
        } else {
            return 'undefined view';
        }
    }
}
