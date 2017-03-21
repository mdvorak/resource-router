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
  Inject,
  Optional,
  InjectionToken
} from '@angular/core';
import { HttpModule } from '@angular/http';
import { APP_API_PREFIX, ApiUrl } from './api-url';
import { ApiLocation } from './api-location';
import { ViewTypeStrategy, ContentTypeStrategy } from './view-type-strategy';
import { RESOURCE_VIEWS, ResourceViewRegistry } from './resource-view-registry';
import { ViewDef } from './view-definition';
import { ApiLinkDirective } from './directives/api-link.directive';
import { ResourceOutletComponent } from './directives/resource-outlet';
import { ViewDataLoader, DefaultHttpViewDataLoader } from './view-data-loader';
import { ResourceDataDirective } from './directives/resource-data';
import { ResourceViewDirective } from './directives/resource-view';
import { DefaultEmptyComponent } from './components/default-empty.component';
import { DefaultErrorComponent } from './components/default-error.component';
import { MEDIA_TYPE_ROUTER_EMPTY, MEDIA_TYPE_ROUTER_LOADING } from './system-media-types';


export const RESOURCE_ROUTER_CONFIGURATION = new InjectionToken<ResourceRouterOptions>('RESOURCE_ROUTER_CONFIGURATION');


@NgModule({
  declarations: [
    ResourceOutletComponent,
    ResourceDataDirective,
    ResourceViewDirective,
    ApiLinkDirective,
    DefaultEmptyComponent,
    DefaultErrorComponent
  ],
  imports: [
    CommonModule,
    HttpModule
  ],
  exports: [ResourceOutletComponent, ResourceDataDirective, ResourceViewDirective, ApiLinkDirective]
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
          useValue: views,
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

export function emptyView(): ViewDef {
  return {
    component: DefaultEmptyComponent,
    status: 204,
    type: [MEDIA_TYPE_ROUTER_EMPTY, MEDIA_TYPE_ROUTER_LOADING],
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
