import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ApiUrl } from './api-url';
import { normalizeUrl } from './normalize';

// TODO normalize location.href

/**
 * It maps view URLs to API and vice versa.
 * Provides bindable `url` property, to be used with `resource-outlet` component.
 */
@Injectable()
export class ApiLocation {

    private urlValue: string;

    constructor(private apiUrlService: ApiUrl,
                private location: Location) {
        this.location.subscribe(this.onLocationChanged);
        this.onLocationChanged();
    }

    /**
     * Resource URL that is being currently viewed.
     * Note: This should not be used to determine current data URL, since this always corresponds to the
     * primary view.
     *
     * @returns Resource URL that is being currently viewed.
     */
    get url(): string {
        return this.urlValue;
    }

    /**
     * Changes browser location (using configured strategy) to given resource url.
     *
     * * * If the `url` is not in the configured API namespace, error is logged and nothing happens.
     * * If the `url` equals to api prefix, it is performed redirect to page base href.
     *
     * @param url API url. The navigation in browser is performed to the `view URL`, that is, without API prefix.
     */
    set url(url: string) {
        // Normalize
        url = normalizeUrl(url);

        // Only on change
        if (url !== this.urlValue) {
            // Navigate
            this.go(url);

            // This prevents race-conditions
            this.urlValue = url;
        }
    }

    go(url: string) {
        if (typeof url !== 'string') {
            throw new Error('url must be a string');
        }

        let path = this.apiUrlService.mapApiToView(url);

        if (path) {
            this.location.go(path);
        } else {
            throw new Error(`Cannot navigate to URL '${url}', it cannot be mapped to the API prefix '${this.apiUrlService.prefix}'`);
        }
    }

    private onLocationChanged = () => {
        const path = this.location.path();

        // Store API url
        this.urlValue = this.apiUrlService.mapViewToApi(path);
    }
}
