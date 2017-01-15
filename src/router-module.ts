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
import { APP_API_PREFIX, ApiUrl } from './api-url';
import { ApiLocation } from './api-location';
import { ResponseTypeStrategy, ContentTypeStrategy } from './response-type-strategy';
import { FALLBACK_ROUTE, RESOURCE_ROUTES, RouteRegistry } from './route-registry';
import { RouteDef } from './config';
import { DefaultMissingRouteDefinitionComponent } from './components/default-missing-route-definition';
import { ApiLinkDirective } from './directives/api-link.directive';
import { ResourceOutletDirective } from './directives/resource-outlet';
import { RouteDataLoader, HttpRouteDataLoader } from './route-data-loader';


export const RESOURCE_ROUTER_CONFIGURATION = new OpaqueToken('RESOURCE_ROUTER_CONFIGURATION');


@NgModule({
    declarations: [
        ResourceOutletDirective,
        ApiLinkDirective,
        DefaultMissingRouteDefinitionComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [ResourceOutletDirective, ApiLinkDirective]
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
                RouteRegistry,
                {
                    provide: APP_API_PREFIX,
                    useValue: options.prefix
                },
                {
                    provide: FALLBACK_ROUTE,
                    useValue: options.fallbackRoute || <RouteDef>{
                        component: DefaultMissingRouteDefinitionComponent
                    }
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
                    provide: RouteDataLoader,
                    useClass: HttpRouteDataLoader
                }
            ]
        };
    }

    static forTypes(routes: RouteDef[]): ModuleWithProviders {
        return {
            ngModule: ResourceRouterModule,
            providers: [
                {
                    provide: RESOURCE_ROUTES,
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
    fallbackRoute?: RouteDef;
}


function provideLocationStrategy(platformLocationStrategy: PlatformLocation, baseHref: string, options: ResourceRouterOptions) {
    return options.useHash
        ? new HashLocationStrategy(platformLocationStrategy, baseHref)
        : new PathLocationStrategy(platformLocationStrategy, baseHref);
}
