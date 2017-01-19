import { Type } from '@angular/core';

export type ResourceTypeMatcher = (type: string, status?: number) => boolean;

export type Data = {
    [name: string]: any
};

export type ResolveData = {
    [name: string]: any
};

export interface ViewDef {
    component: Type<any>;

    type?: string;
    matcher?: ResourceTypeMatcher;

    data?: Data; // TODO not supported yet
    resolve?: ResolveData; // TODO not supported yet
}
