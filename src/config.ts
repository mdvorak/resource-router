import { Type } from '@angular/core';

export type RouteMatcher = (type: string, status?: number) => boolean;

export type Data = {
    [name: string]: any
};

export type ResolveData = {
    [name: string]: any
};

export interface RouteDef {
    component: Type<any>;

    type?: string;
    matcher?: RouteMatcher;

    data?: Data; // TODO not supported yet
    resolve?: ResolveData; // TODO not supported yet
}
