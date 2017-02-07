import { Type } from '@angular/core';

export type ResourceTypeMatcher = (type: string, status?: number) => boolean;

export type Data = {
    [name: string]: any
};

export interface ViewDef {

    component: Type<any>;
    body?: string;

    type?: string;
    status?: number|string;
    matcher?: ResourceTypeMatcher|RegExp;

    data?: Data;
    resolve?: Data;
}
