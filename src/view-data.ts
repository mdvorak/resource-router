import { Response, Headers } from '@angular/http';
import { Type } from '@angular/core';
import { ViewDef } from './config';

export class ViewData<T> {

    readonly component: Type<any>;

    get status(): number {
        return this.response.status;
    }

    get statusText(): string {
        return this.response.statusText;
    }

    get headers(): Headers {
        return this.response.headers;
    }

    get url(): string {
        return this.response.url;
    }

    constructor(public readonly response: Response,
                public readonly type: string,
                public readonly body: T,
                view: ViewDef) {
        this.component = view.component;
    }
}
