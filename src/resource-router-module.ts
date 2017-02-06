import {
    APP_BASE_HREF,
    PlatformLocation,
    HashLocationStrategy,
    PathLocationStrategy,
    LocationStrategy,
    Location,
    CommonModule
} from '@angular/common';
import {
    ANALYZE_FOR_ENTRY_COMPONENTS,
    NgModule,
    ModuleWithProviders,
    Type,
    OpaqueToken,
    Inject,
    Optional
} from '@angular/core';
import { HttpModule } from '@angular/http';
import { APP_API_PREFIX, ApiUrl } from './api-url';
import { ApiLocation } from './api-location';
import { ResponseTypeStrategy, ContentTypeStrategy } from './response-type-strategy';
import { FALLBACK_VIEW, RESOURCE_VIEWS, ResourceViewRegistry } from './resource-view-registry';
import { ViewDef } from './view-definition';
import { DefaultMissingRouteDefinitionComponent } from './components/default-missing-route-definition';
import { ApiLinkDirective } from './directives/api-link.directive';
import { ResourceOutletDirective } from './directives/resource-outlet';
import { ViewDataLoader, HttpViewDataLoader } from './view-data-loader';
import { ResourceDataDirective } from './directives/resource-data';
import { ResourceViewDirective } from './directives/resource-view';


export const RESOURCE_ROUTER_CONFIGURATION = new OpaqueToken('RESOURCE_ROUTER_CONFIGURATION');


@NgModule({
    declarations: [
        ResourceOutletDirective,
        ResourceDataDirective,
        ResourceViewDirective,
        ApiLinkDirective,
        DefaultMissingRouteDefinitionComponent
    ],
    imports: [
        CommonModule,
        HttpModule
    ],
    exports: [ResourceOutletDirective, ResourceDataDirective, ResourceViewDirective, ApiLinkDirective]
})
export class ResourceRouterModule {

    static configure(options: ResourceRouterOptions): ModuleWithProviders {
        return {
            ngModule: ResourceRouterModule,
            providers: [
                {
                    provide: LocationStrategy,
                    useFactory: provideLocationStrategy,
                    deps: [
                        PlatformLocation, [new Inject(APP_BASE_HREF), new Optional()], RESOURCE_ROUTER_CONFIGURATION
                    ]
                },
                Location,
                ApiUrl,
                ApiLocation,
                ResourceViewRegistry,
                {
                    provide: APP_API_PREFIX,
                    useValue: options.prefix
                },
                {
                    provide: FALLBACK_VIEW,
                    useValue: options.fallbackView || fallbackView()
                },
                {
                    provide: RESOURCE_ROUTER_CONFIGURATION,
                    useValue: options
                },
                {
                    provide: ANALYZE_FOR_ENTRY_COMPONENTS,
                    useValue: [DefaultMissingRouteDefinitionComponent],
                    multi: true
                },
                {
                    provide: ResponseTypeStrategy,
                    useClass: options.responseTypeStrategy || ContentTypeStrategy
                },
                {
                    provide: ViewDataLoader,
                    useClass: HttpViewDataLoader
                }
            ]
        };
    }

    static forTypes(routes: ViewDef[]): ModuleWithProviders {
        return {
            ngModule: ResourceRouterModule,
            providers: [
                {
                    provide: RESOURCE_VIEWS,
                    useValue: routes,
                    multi: true
                },
                {
                    provide: ANALYZE_FOR_ENTRY_COMPONENTS,
                    useValue: routes,
                    multi: true
                }
            ]
        };
    }
}

export interface ResourceRouterOptions {
    prefix: string;
    useHash?: boolean;
    responseTypeStrategy?: Type<ResponseTypeStrategy>;
    fallbackView?: ViewDef;
}


export function provideLocationStrategy(platformLocationStrategy: PlatformLocation, baseHref: string, options: ResourceRouterOptions) {
    return options.useHash
        ? new HashLocationStrategy(platformLocationStrategy, baseHref)
        : new PathLocationStrategy(platformLocationStrategy, baseHref);
}

export function fallbackView(): ViewDef {
    return {
        component: DefaultMissingRouteDefinitionComponent,
        body: 'text'
    };
}
