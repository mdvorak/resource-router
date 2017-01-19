import { Response } from '@angular/http';
import { Data } from './config';

export class ActiveViewData {

    constructor(public readonly response: Response,
                public readonly type: string,
                public readonly data: Data) {
    }

    get url(): string {
        return this.response.url;
    }

    json(): any {
        return this.response.json();
    }

    text(): string {
        return this.response.text();
    }
}
