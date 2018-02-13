<a name="4.1.1"></a>
# [4.1.1](https://github.com/mdvorak/resource-router/compare/v4.0.0...v4.1.0) (2018-02-14)

### Resolved Issues

* [#26](https://github.com/mdvorak/resource-router/issues/26) When HttpResourceClient request fails, error is swallowed

<a name="4.1.0"></a>
# [4.1.0](https://github.com/mdvorak/resource-router/compare/v4.0.0...v4.1.0) (2018-02-12)

<strong>This is breaking release, despite it breaks semantic versioning. Its for Angular v4.x applications to allow migration to new model and Angular v5.x</strong>

Changed data used in components to reactive pattern, which allows reuse of created view components.

### Breaking Changes

* `ViewData` is no longer available for injection, use `ActivatedView` instead:
  ```ts
  @Component(...)
  export class SampleComponent implements OnInit {
  
    public data: MyData;
  
    constructor(public view: ActivatedView<MyData>) {
    }
  
    ngOnInit(): void {
      this.view.data.subscribe(data => this.data = data.body);
    }
  }
  ```
* ResourceData directive now needs to be accompanied by `[resourceContext]` directive:
  ```angular2html
  <div *resourceData="let data of apiLocation" [resourceContext]="data">
    <resource-view [data]="data"></resource-view>
  </div>
  ```
  Otherwise navigation (resourceLinks) won't work.
  
  _Note that navigation internals might change in future releases._
* Many internal components were changed or moved. See https://github.com/mdvorak/resource-router/pull/24/commits for whole changelog

### Features

* Added `Link` interface that describes [HAL link](https://github.com/mikekelly/hal_specification/blob/master/hal_specification.md).
* Added `ResourceData` class that can be used to programmatically load and navigate resource.
* Added `[resourceContext]` support directive which can provides navigation context for nested components.
* Added `debugLog` that is used when angular does not run in developer mode. This feature will be extended in the future.
  
### Resolved Issues

* [#6](https://github.com/mdvorak/resource-router/issues/6) Change ApiLocation and NavigationHandler to reactive pattern
* [#7](https://github.com/mdvorak/resource-router/issues/7) resource-data directive should provide loading property
* [#9](https://github.com/mdvorak/resource-router/issues/9) Change ViewData to reactive pattern
* [#21](https://github.com/mdvorak/resource-router/issues/21) Replace *resource-data directive with simple class
* [#23](https://github.com/mdvorak/resource-router/issues/23) Broken travis build


<a name="4.0.0"></a>
# [4.0.0](https://github.com/mdvorak/resource-router/compare/v1.0.0-alpha.12...v4.0.0) (2017-12-30)

Bumping to 4.x, to match Angular version.
Moved from gulp custom build script to [ng-packagr](https://github.com/dherges/ng-packagr).

### Breaking Changes

* Upgraded to use [HttpClient](https://angular.io/api/common/http/HttpClient) instead of deprecated `Http`
* Renamed route config key `body` to `responseType`
* `responseType` now supports only `json` and `text` values - `blob` was buggy in old implementation 
  and its use would be very rare
* Refactored `ApiMapper` component - there is now `ApiUrl` and `ApiMapper` abstract classes, 
  with default implementations.
* Typescript 2.3 (newer is not supported by Angular 4.x)

### Bug Fixes

* [#17](https://github.com/mdvorak/resource-router/issues/17) `[resourceLink]` should now properly handle external URLs (those that cannot be mapped to an API endpoint)
* Various fixes with API prefixes and URL handling in general

<a name="1.0.0-alpha.12"></a>
# [1.0.0-alpha.12](https://github.com/mdvorak/resource-router/compare/d1ab3bca8ea40991ed7b5e09aad06de3c828e6a1...fd09fc783ff8966c15d8c02cc95dd0a66d8f99e0) (2017-04-22)

Now compiled with `strictNullChecks: true` typescript option, which leads to explicit 
optional function arguments.

* Final UMD bundle now contains source maps
* Example is now built with @angular/cli

### Breaking Changes

* Moved to Angular 4.0.0
* Moved to Typescript 2.1+
* Deprecated `apiLink` directive in favour of new `resourceLink` (which conforms to Angular naming convention)
* Renamed `ApiUrl` class to `ApiMapper` (relates to #13)

### Features

* Compiled with strictNullChecks
* `resourceLink` is new directive, which fixes navigation problems, page reloads, and works both on `<a>` (with more features) and other tags like `<button>` (closes #15)
