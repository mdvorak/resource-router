<a name="4.1.0"></a>
# [4.1.0](https://github.com/mdvorak/resource-router/compare/v4.0.0...v4.1.0) (2017-12-31)

Changed data used in components to reactive pattern, which allows reuse of created view components.
From now on, component should be initialized as follows:
```
@Component(...)
export class SampleComponent {

  public data: MyData;

  constructor(public view: ActivatedView<MyData>) {
  }

  ngOnInit(): void {
    this.view.data.subscribe(data => this.data = data.body);
  }
}
```


### Breaking Changes

* `ViewData` is no longer available for injection, use `ActivatedView` instead

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

* `[resourceLink]` should now properly handle external URLs (those that cannot be mapped to an API endpoint)
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
