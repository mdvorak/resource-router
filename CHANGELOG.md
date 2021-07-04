<a name="9.3.0"></a>
# [9.3.0](https://github.com/mdvorak/resource-router/compare/v9.2.0...v9.3.0) (2021-05-10)

* Added `loadChildren` to `ViewDef`.
* Support lazy loading.

<a name="9.2.0"></a>
# [9.2.0](https://github.com/mdvorak/resource-router/compare/v9.1.0...v9.2.0) (2021-02-24)

* Added `resolve` to `ViewData`.
* Added `resolve: Observable<ResolveData>` to `ActivatedView` class, which is same as `view.data.subscribe(data => ... = data.resolve.#resolverName);`.
* Added `[resourceLinkActive]` combine with `[resourceLink]` support directive that can add classes to active elements in the navigation menu

<a name="9.1.0"></a>
# [9.1.0](https://github.com/mdvorak/resource-router/compare/v7.0.0...v9.1.0) (2020-06-23)

updated to Angular 9.1.11

<a name="7.0.0"></a>
# [7.0.0](https://github.com/mdvorak/resource-router/compare/v5.0.1...v7.0.0) (2019-02-25)

Updated to Angular 7.x. Thanks [Zakir](https://github.com/zabdalimovcsas) for PR.

<a name="5.0.1"></a>
# [5.0.1](https://github.com/mdvorak/resource-router/compare/v5.0.0...v5.0.1) (2018-02-16)

Adapted original [Tour of Heroes](https://stackblitz.com/angular/oarvopmjgjv) Angular example to use this router. It is missing some features, but
take a look at [Live Demo](https://stackblitz.com/edit/angular-restful-heroes).

### Features

* Added `body: Observable<T>` to `ActivatedView<T>` class, which is same as `view.data.subscribe(data => ... = data.body);`
* `SingleApiMapper` now supports host-relative urls (`/api/foobar`)
* Example app is now adapted Tour of Heroes from Angular. Uses mock in-memory API.
* [#31](https://github.com/mdvorak/resource-router/issues/31) `npm run buildapp` now requires library to be built in dist folder, and tests whether it is AOT compilable

### Bug Fixes

* Fixed several `Observable` operator imports

<a name="5.0.0"></a>
# [5.0.0](https://github.com/mdvorak/resource-router/compare/v4.1.1...v5.0.0) (2018-02-15)

Version for Angular 5.x, otherwise almost identical with 4.1.1.

### Features

* Improved `DefaultErrorComponent`, now it renders html as content instead of code
* Docs no longer contain internal components
* Internally improved config, tests now no longer needs library to be built

<a name="4.1.1"></a>
# [4.1.1](https://github.com/mdvorak/resource-router/compare/v4.1.0...v4.1.1) (2018-02-14)

### Resolved Issues

* [#26](https://github.com/mdvorak/resource-router/issues/26) When HttpResourceClient request fails, error is swallowed
* [#28](https://github.com/mdvorak/resource-router/issues/28) v4.1.0 is broken in production mode

### Known Problems

* As result of [#26](https://github.com/mdvorak/resource-router/issues/26), error value might be now consumed in some cases.
  Created [#27](https://github.com/mdvorak/resource-router/issues/27) to address the issue.

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
