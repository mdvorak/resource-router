import {Inject, Injectable, OpaqueToken} from '@angular/core';
import {RouteDef, RouteMatcher} from './config';
import {normalizeMediaType} from './normalize';

export const RESOURCE_ROUTES = new OpaqueToken('RESOURCE_ROUTES');
export const FALLBACK_ROUTE = new OpaqueToken('FALLBACK_ROUTE');


// TODO error and status code matching

@Injectable()
export class RouteRegistry {
    private exact = new Map<string, RouteDef>();
    private matchers: Array<{m: RouteMatcher, d: RouteDef}> = [];

    constructor(@Inject(RESOURCE_ROUTES) routes: any,
                @Inject(FALLBACK_ROUTE) fallbackRoute: RouteDef) {
        // Flatten route declarations
        this.addRoute(routes);

        // Fallback route
        this.exact.set(FALLBACK_ROUTE.toString(), fallbackRoute);
    }

    match(mediaType: string, status?: number): RouteDef {
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
        return this.exact.get(FALLBACK_ROUTE.toString());
    }

    isKnownType(mediaType: string, status?: number): boolean {
        return mediaType && !!this.match(normalizeMediaType(mediaType), status);
    }

    //noinspection JSMethodCanBeStatic
    protected validateRoute(route: RouteDef): void {
        if (!route.type) {
            throw new Error('Invalid configuration of route, route type must be set');
        }
        if (!route.component) {
            throw new Error('Invalid configuration of route, route component must be set');
        }
    }

    private addRoute(route: RouteDef|any): void {
        // Nulls are not allowed
        if (!route) {
            throw new Error('Invalid configuration of route, encountered undefined route.');
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
function wildcardMatcherFactory(wildcard: string): RouteMatcher {
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
