import { Response } from '@angular/http';
import { Data, ResolveData, ViewDef } from './config';
import { Type } from '@angular/core';

export class ViewData {

    component: Type<any>;
    data?: Data; // TODO not supported yet
    resolve?: ResolveData; // TODO not supported yet

    constructor(public response: Response,
                public type: string,
                route: ViewDef) {
        this.component = route.component;
        this.data = route.data;
        this.resolve = route.resolve;
    }
}
