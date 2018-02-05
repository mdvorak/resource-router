import {
  APP_BASE_HREF,
  CommonModule,
  HashLocationStrategy,
  Location,
  LocationStrategy,
  PathLocationStrategy,
  PlatformLocation
} from '@angular/common';
import {
  ANALYZE_FOR_ENTRY_COMPONENTS,
  Inject,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  Optional,
  Type
} from '@angular/core';
import { ApiMapper } from './api-mapper';
import { ApiLocation } from './api-location';
import { HeaderViewTypeStrategy, ViewTypeStrategy } from './view-type-strategy';
import { RESOURCE_VIEWS, ResourceViewRegistry } from './resource-view-registry';
import { ViewDef } from './view-definition';
import { ResourceLinkDirective } from './directives/resource-link';
import { ResourceLinkWithHrefDirective } from './directives/resource-link-with-href';
import { ResourceOutletComponent } from './directives/resource-outlet';
import { HttpResourceClient, ResourceClient } from './resource-client';
import { ResourceDataOfDirective } from './directives/resource-data-of';
import { ResourceViewDirective } from './directives/resource-view';
import { DefaultEmptyComponent } from './components/default-empty.component';
import { DefaultErrorComponent } from './components/default-error.component';
import { MEDIA_TYPE_ROUTER_EMPTY, MEDIA_TYPE_ROUTER_LOADING } from './system-media-types';
import { ApiUrl, BrowserApiUrl } from './api-url';
import { APP_API_PREFIX, SingleApiMapper } from './single-api-mapper';


export const RESOURCE_ROUTER_CONFIGURATION = new InjectionToken<ResourceRouterOptions>('RESOURCE_ROUTER_CONFIGURATION');


/**
 * Set of global configuration options for {@link ResourceRouterModule}.
 */
export interface ResourceRouterOptions {
  /**
   * Prefix for the URL. Can be base-relative, host-relative or absolute.
   * Always should however end with slash ('/').
   *
   * When using hash-bang navigation mode ({@link useHash}=true), this must be either full context path or absolute path.
   * That is, either '/my/context/api/' or 'http://example.com/my/context/api'. Relative path 'api/' won't work.
   *
   * Another way is to set {@link APP_BASE_HREF} explicitly - HashLocationStrategy does not use <base> tag.
   */
  readonly prefix: string;

  /**
   * Enables hash-bang navigation mode. Default is HTML5 mode.
   *
   * Read {@link #prefix} details when setting to true.
   */
  readonly useHash?: boolean;

  /**
   * Changes implementation of {@link ViewTypeStrategy}.
   * Default is {@link HeaderViewTypeStrategy} using `Content-Type` header.
   */
  readonly viewTypeStrategy?: Type<ViewTypeStrategy>;

  /**
   * Changes implementation of {@link ResourceClient}.
   * Default is {@link HttpResourceClient}.
   */
  readonly viewDataLoader?: Type<ResourceClient>;
}


@NgModule({
  declarations: [
    ResourceOutletComponent,
    ResourceDataOfDirective,
    ResourceViewDirective,
    ResourceLinkDirective,
    ResourceLinkWithHrefDirective,
    DefaultEmptyComponent,
    DefaultErrorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ResourceOutletComponent,
    ResourceDataOfDirective,
    ResourceViewDirective,
    ResourceLinkDirective,
    ResourceLinkWithHrefDirective
  ]
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
        {
          provide: ApiUrl,
          useClass: BrowserApiUrl
        },
        {
          provide: ApiMapper,
          useClass: SingleApiMapper
        },
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
          useValue: [emptyView(), errorView()],
          multi: true
        },
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          useValue: [DefaultErrorComponent, DefaultEmptyComponent],
          multi: true
        },
        {
          provide: ViewTypeStrategy,
          useClass: options.viewTypeStrategy || HeaderViewTypeStrategy
        },
        {
          provide: ResourceClient,
          useClass: options.viewDataLoader || HttpResourceClient
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
          useValue: views,
          multi: true
        }
      ]
    };
  }
}


/**
 * Internal factory function, exported only for AOT support.
 */
export function provideLocationStrategy(platformLocationStrategy: PlatformLocation, baseHref: string, options: ResourceRouterOptions) {
  return options.useHash
    ? new HashLocationStrategy(platformLocationStrategy, baseHref)
    : new PathLocationStrategy(platformLocationStrategy, baseHref);
}

/**
 * Internal factory function, exported only for AOT support.
 */
export function emptyView(): ViewDef {
  return {
    component: DefaultEmptyComponent,
    status: 204,
    type: [MEDIA_TYPE_ROUTER_EMPTY, MEDIA_TYPE_ROUTER_LOADING],
    quality: Number.MIN_SAFE_INTEGER
  };
}

/**
 * Internal factory function, exported only for AOT support.
 */
export function errorView(): ViewDef {
  return {
    component: DefaultErrorComponent,
    status: '*',
    type: '*',
    responseType: 'text',
    quality: Number.MIN_SAFE_INTEGER
  };
}
