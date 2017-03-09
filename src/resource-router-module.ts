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
import { ViewTypeStrategy, ContentTypeStrategy } from './view-type-strategy';
import { RESOURCE_VIEWS, ResourceViewRegistry } from './resource-view-registry';
import { ViewDef } from './view-definition';
import { ApiLinkDirective } from './directives/api-link.directive';
import { ResourceOutletDirective } from './directives/resource-outlet';
import { ViewDataLoader, DefaultHttpViewDataLoader } from './view-data-loader';
import { ResourceDataDirective } from './directives/resource-data';
import { ResourceViewDirective } from './directives/resource-view';
import { DefaultEmptyComponent } from './components/default-empty.component';
import { DefaultLoadingComponent } from './components/default-loading.component';
import { DefaultErrorComponent } from './components/default-error.component';


export const RESOURCE_ROUTER_CONFIGURATION = new OpaqueToken('RESOURCE_ROUTER_CONFIGURATION');


@NgModule({
    declarations: [
        ResourceOutletDirective,
        ResourceDataDirective,
        ResourceViewDirective,
        ApiLinkDirective,
        DefaultEmptyComponent,
        DefaultLoadingComponent,
        DefaultErrorComponent
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
                    provide: RESOURCE_ROUTER_CONFIGURATION,
                    useValue: options
                },
                {
                    provide: RESOURCE_VIEWS,
                    useValue: [loadingView(), errorView(), emptyView()],
                    multi: true
                },
                {
                    provide: ANALYZE_FOR_ENTRY_COMPONENTS,
                    useValue: [DefaultLoadingComponent, DefaultErrorComponent, DefaultEmptyComponent],
                    multi: true
                },
                {
                    provide: ViewTypeStrategy,
                    useClass: options.responseTypeStrategy || ContentTypeStrategy
                },
                {
                    provide: ViewDataLoader,
                    useClass: DefaultHttpViewDataLoader
                }
            ]
        };
    }

    static forTypes(views: ViewDef[]): ModuleWithProviders {
        return {
            ngModule: ResourceRouterModule,
            providers: [
                {
                    provide: RESOURCE_VIEWS,
                    useValue: views,
                    multi: true
                },
                {
                    provide: ANALYZE_FOR_ENTRY_COMPONENTS,
                    useValue: views.map(v => v.component),
                    multi: true
                }
            ]
        };
    }
}

export interface ResourceRouterOptions {
    prefix: string;
    useHash?: boolean;
    responseTypeStrategy?: Type<ViewTypeStrategy>;
    fallbackView?: ViewDef;
}


export function provideLocationStrategy(platformLocationStrategy: PlatformLocation, baseHref: string, options: ResourceRouterOptions) {
    return options.useHash
        ? new HashLocationStrategy(platformLocationStrategy, baseHref)
        : new PathLocationStrategy(platformLocationStrategy, baseHref);
}

export function loadingView(): ViewDef {
    return {
        component: DefaultLoadingComponent,
        status: 204,
        type: 'router/loading',
        quality: Number.MIN_SAFE_INTEGER
    };
}

export function emptyView(): ViewDef {
    return {
        component: DefaultEmptyComponent,
        status: 204,
        type: 'router/empty',
        quality: Number.MIN_SAFE_INTEGER
    };
}

export function errorView(): ViewDef {
    return {
        component: DefaultErrorComponent,
        status: '*',
        type: '*',
        body: 'text',
        quality: Number.MIN_SAFE_INTEGER
    };
}