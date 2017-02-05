import { Type } from '@angular/core';

export type ResourceTypeMatcher = (type: string, status?: number) => boolean;

export type ResolveData = {
    [name: string]: any
};

export interface ViewDef {

    component: Type<any>;
    response?: string;

    type?: string;
    status?: number|string;
    matcher?: ResourceTypeMatcher;

    // TODO resolve?: ResolveData;
}
