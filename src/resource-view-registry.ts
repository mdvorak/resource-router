import { Inject, Injectable, OpaqueToken, Optional } from '@angular/core';
import { ViewDef, ResourceTypeMatcher } from './view-definition';
import { normalizeMediaType } from './normalize';

export const RESOURCE_VIEWS = new OpaqueToken('RESOURCE_VIEWS');
export const FALLBACK_VIEW = new OpaqueToken('FALLBACK_VIEW');


@Injectable()
export class ResourceViewRegistry {

    private exact = new Map<string, ViewDef>();
    private wildcards: Array<{m: ResourceTypeMatcher, d: ViewDef}> = [];
    private custom: Array<{m: ResourceTypeMatcher, d: ViewDef}> = [];

    constructor(@Inject(RESOURCE_VIEWS) @Optional() views: any,
                @Inject(FALLBACK_VIEW) fallbackView: ViewDef) {
        if (!views) {
            throw new Error('No view definitions found! See ResourceRouterModule.forTypes(...) method for more details');
        }

        // Flatten data declarations
        this.addViews(views);

        // Fallback data
        this.exact.set(FALLBACK_VIEW.toString(), fallbackView);
    }

    match(mediaType: string, status?: number): ViewDef {
        let data: ViewDef;

        // Exact match with status
        if (status) {
            data = this.exact[status + ':' + mediaType];
            if (data) return data;
        }

        // Exact match of type
        data = this.exact[mediaType];
        if (data) return data;

        // Exact match of status only
        if (status) {
            data = this.exact['' + status];
            if (data) return data;
        }

        // Test matchers
        for (let matcher of this.wildcards) {
            if (matcher.m(mediaType, status)) {
                return matcher.d;
            }
        }

        for (let matcher of this.custom) {
            if (matcher.m(mediaType, status)) {
                return matcher.d;
            }
        }

        // Not found
        return this.exact.get(FALLBACK_VIEW.toString());
    }

    isKnownType(mediaType: string, status?: number): boolean {
        return mediaType && !!this.match(normalizeMediaType(mediaType), status);
    }

    //noinspection JSMethodCanBeStatic
    protected validateRoute(view: ViewDef): void {
        if (!view.component) {
            throw validationError(view, 'component is mandatory');
        }

        if (view.matcher && (typeof view.matcher !== 'function' || view.matcher instanceof RegExp)) {
            throw validationError(view, 'matcher must be a function');
        }
        if (view.type && typeof view.type !== 'string') {
            throw validationError(view, 'type must be a string');
        }
        if (view.status && typeof view.status !== 'number' && typeof view.status !== 'string') {
            throw validationError(view, 'status must be either number or a string');
        }

        if (view.matcher) {
            if (view.type || view.status) {
                throw validationError(view, 'when matcher is set, type and status must be undefined');
            }
        } else if (!view.type && !view.status) {
            throw validationError(view, 'either type, status or matcher must be set');
        }
    }

    private addViews(view: ViewDef|any): void {
        // Nulls are not allowed
        if (!view) {
            throw new Error('Invalid configuration of data, encountered undefined.');
        }

        // Flatten array
        if (Array.isArray(view)) {
            // Recursive call
            view.forEach(this.addViews, this);
        } else {
            // Sanity check
            this.validateRoute(view);

            // Add to internal collections
            if (view.matcher) {
                // Register function matcher
                this.custom.push({
                    m: view.matcher instanceof RegExp ? RegExp.prototype.test.bind(view.matcher) : view.matcher,
                    d: view
                });
            } else {
                const type = join2(':', '' + view.status, view.type);

                if (/[*?]/.test(type)) {
                    // Register wildcard matcher
                    let matcher = {
                        m: wildcardMatcherFactory(type),
                        d: view
                    };

                    this.wildcards.push(matcher);
                } else {
                    // Exact match
                    this.exact[type] = view;
                }
            }
        }
    }
}


// Private helper functions
function wildcardMatcherFactory(wildcard: string): ResourceTypeMatcher {
    const pattern = new RegExp('^' + wildcardToRegexPattern(wildcard) + '$');

    // Register matcher
    return function wildcardMatcher(type: string, status?: number) {
        return pattern.test(type);
    };
}

function wildcardToRegexPattern(s: string): string {
    return s.replace(/([-()\[\]{}+.$\^|,:#<!\\])/g, '\\$1')
        .replace(/\x08/g, '\\x08')
        .replace(/[*]+/g, '.*')
        .replace(/[?]/g, '.');
}

function validationError(view: any, text: string): Error {
    return new Error('Invalid view configuration, ' + text + ':\n' + JSON.stringify(view));
}

function join2(sep: string, a: string, b: string): string {
    if (a && b)
        return a + sep + b;
    return a || b;
}
