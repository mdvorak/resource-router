import {
  APP_BASE_HREF,
  CommonModule,
  HashLocationStrategy,
  Location,
  LocationStrategy,
  PathLocationStrategy,
  PlatformLocation
} from '@angular/common';
import { ANALYZE_FOR_ENTRY_COMPONENTS, Inject, InjectionToken, ModuleWithProviders, NgModule, Optional, Type } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ApiMapper, APP_API_PREFIX } from './api-mapper';
import { ApiLocation } from './api-location';
import { ContentTypeStrategy, ViewTypeStrategy } from './view-type-strategy';
import { RESOURCE_VIEWS, ResourceViewRegistry } from './resource-view-registry';
import { ViewDef } from './view-definition';
import { ResourceLinkDirective } from './directives/resource-link';
import { ResourceLinkWithHrefDirective } from './directives/resource-link-with-href';
import { ResourceOutletComponent } from './directives/resource-outlet';
import { DefaultHttpViewDataLoader, ViewDataLoader } from './view-data-loader';
import { ResourceDataDirective } from './directives/resource-data';
import { ResourceViewDirective } from './directives/resource-view';
import { DefaultEmptyComponent } from './components/default-empty.component';
import { DefaultErrorComponent } from './components/default-error.component';
import { MEDIA_TYPE_ROUTER_EMPTY, MEDIA_TYPE_ROUTER_LOADING } from './system-media-types';


export const RESOURCE_ROUTER_CONFIGURATION = new InjectionToken<ResourceRouterOptions>('RESOURCE_ROUTER_CONFIGURATION');


/**
 * Set of global configuration options for {@link ResourceRouterModule}.
 */
export interface ResourceRouterOptions {
  /**
   * Prefix for the URL. Can be base-relative, host-relative or absolute.
   * Always should however end with slash ('/').
   */
  prefix: string;

  /**
   * Enables hash-bang navigation mode. Default is HTML5 mode.
   */
  useHash?: boolean;

  /**
   * Changes implementation of {@link ViewTypeStrategy}.
   * Default is {@link ContentTypeStrategy}.
   */
  viewTypeStrategy?: Type<ViewTypeStrategy>;
}


@NgModule({
  declarations: [
    ResourceOutletComponent,
    ResourceDataDirective,
    ResourceViewDirective,
    ResourceLinkDirective,
    ResourceLinkWithHrefDirective,
    DefaultEmptyComponent,
    DefaultErrorComponent
  ],
  imports: [
    CommonModule,
    HttpModule
  ],
  exports: [
    ResourceOutletComponent,
    ResourceDataDirective,
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
        ApiMapper,
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
          useClass: options.viewTypeStrategy || ContentTypeStrategy
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
    body: 'text',
    quality: Number.MIN_SAFE_INTEGER
  };
}
