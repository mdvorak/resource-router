import { Inject, Injectable, OpaqueToken, Optional } from '@angular/core';
import { ViewDef, ResourceTypeMatcher } from './view-definition';
import { normalizeMediaType } from './normalize';

export const RESOURCE_VIEWS = new OpaqueToken('RESOURCE_VIEWS');
export const FALLBACK_VIEW = new OpaqueToken('FALLBACK_VIEW');


// TODO error and status code matching

@Injectable()
export class ResourceViewRegistry {
    private exact = new Map<string, ViewDef>();
    private matchers: Array<{m: ResourceTypeMatcher, d: ViewDef}> = [];

    constructor(@Inject(RESOURCE_VIEWS) @Optional() routes: any,
                @Inject(FALLBACK_VIEW) fallbackView: ViewDef) {
        if (!routes) {
            throw new Error('No routes defined! See ResourceRouterModule.forTypes(...) method for more details');
        }

        // Flatten data declarations
        this.addRoute(routes);

        // Fallback data
        this.exact.set(FALLBACK_VIEW.toString(), fallbackView);
    }

    match(mediaType: string, status?: number): ViewDef {
        // Exact match
        let data = this.exact[mediaType];
        if (data) return data;

        // Iterate matcher functions
        for (let matcher of this.matchers) {
            if (matcher.m(mediaType, status)) {
                return matcher.d;
            }
        }

        // Not found
        // TODO do we really want this?
        return this.exact.get(FALLBACK_VIEW.toString());
    }

    isKnownType(mediaType: string, status?: number): boolean {
        return mediaType && !!this.match(normalizeMediaType(mediaType), status);
    }

    //noinspection JSMethodCanBeStatic
    protected validateRoute(route: ViewDef): void {
        if (!route.type) {
            throw new Error('Invalid configuration of data, data type must be set');
        }
        if (!route.component) {
            throw new Error('Invalid configuration of data, data component must be set');
        }
    }

    private addRoute(route: ViewDef|any): void {
        // Nulls are not allowed
        if (!route) {
            throw new Error('Invalid configuration of data, encountered undefined data.');
        }

        // Flatten array
        if (Array.isArray(route)) {
            // Recursive call
            route.forEach(this.addRoute, this);
        } else {
            // Sanity check
            this.validateRoute(route);

            // Add to internal collections
            if (typeof route.type === 'function') {
                // Register external matcher
                this.matchers.push({
                    m: route.type,
                    d: route
                });
            } else {
                const type = normalizeMediaType(route.type);

                if (/[*?]/.test(type)) {
                    // Register wildcard matcher
                    this.matchers.push({
                        m: wildcardMatcherFactory(type),
                        d: route
                    });
                } else {
                    // Exact match
                    this.exact[type] = route;
                }
            }
        }
    }
}


// Private helper functions
function wildcardMatcherFactory(wildcard: string): ResourceTypeMatcher {
    const pattern = new RegExp('^' + wildcardToRegexPattern(wildcard) + '$');

    // Register matcher
    return function wildcardMatcher(s) {
        return pattern.test(s);
    };
}

function wildcardToRegexPattern(s: string): string {
    return s.replace(/([-()\[\]{}+.$\^|,:#<!\\])/g, '\\$1')
        .replace(/\x08/g, '\\x08')
        .replace(/[*]+/g, '.*')
        .replace(/[?]/g, '.');
}
