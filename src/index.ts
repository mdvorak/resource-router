export { ResourceRouterModule, ResourceRouterOptions, RESOURCE_ROUTER_CONFIGURATION } from './resource-router-module';
export { ViewData } from './view-data';
export { ViewDataLoader, HttpViewDataLoader, DefaultHttpViewDataLoader } from './view-data-loader';
export { ViewDef, Data, StatusType } from './view-definition';
export { ApiUrl, APP_API_PREFIX } from './api-url';
export { ApiLocation } from './api-location';
export { ResourceViewRegistry, RESOURCE_VIEWS, TYPE_QUALITY_EVALUATOR } from './resource-view-registry'
export { ResourceOutletComponent } from './directives/resource-outlet';
export { ApiLinkDirective } from './directives/api-link.directive';
export { ResourceDataDirective } from './directives/resource-data';
export { ResourceViewDirective } from './directives/resource-view';
export { TypeQualityEvaluator, simpleTypeQualityEvaluator, statusQualityEvaluator } from './quality-evaluator';
export { NavigationHandler } from './navigation-handler'
export { normalizeUrl, normalizeMediaType }from './normalize';
export * from './system-media-types';
export { ViewTypeStrategy, ContentTypeStrategy } from './view-type-strategy';
export { escapeRegExpPattern, wildcardToRegex } from './utils/wildcard-to-regex';
