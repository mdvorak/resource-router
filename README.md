# resource-router

[![Build Status](https://travis-ci.org/mdvorak/resource-router.svg?branch=master)](https://travis-ci.org/mdvorak/resource-router)

[Angular](https://angular.io/) routing engine that drive views by media types. It loads data itself, and by response `Content-Type` header
it displays configured view. It is a replacement for original [Angular Router](https://angular.io/docs/ts/latest/guide/router.html) (they cannot be used at the same time).

The aim of this library is to allow building of RESTful clients using Angular, following [HATEOAS](http://en.wikipedia.org/wiki/HATEOAS) principle.

See [changelog](CHANGELOG.md) for release changes.

## Installation

    npm i angular-resource-router --save


## Configuration

Sample snippet how is the router configured.
It is very similar to original router, but instead of registering paths, we are registering media types.

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ResourceRouterModule } from 'angular-resource-router';
import { AppComponent } from './app.component';
import { SampleComponent } from './sample.component';
import { ErrorComponent } from './error.component';

@NgModule({
  declarations: [
    AppComponent,
    SampleComponent
  ],
  imports: [
    BrowserModule,
    ResourceRouterModule.configure({
      prefix: 'api/'
    }),
    ResourceRouterModule.forTypes([
      {
        type: 'application/x.sample',
        component: SampleComponent
      },
      {
        status: '*',
        type: '*',
        component: ErrorComponent
      }
    ])
  ],
  bootstrap: [
    AppComponent
  ]
})
export class ExampleModule {
}
```

## How It Works

TODO

## Development

TODO this is cumbersome but there seems to be no way around it atm.

Run `npm run ng-packagr` once, but it will fail. 
After that, run `npm link dist\angular-resource-router && npm link angular-resource-router`.
Build should be working after that. Final build should be performed with
```
npm package
```
and can be published with
```
npm publish dist/angular-resource-router
```

## TODO

Things that are yet to be implemented

* Complete README
* Complete example
* Support for `resolve` and `data` route configs
* Support for <s>outlet layouts</s>, outlet resolve
* Outlet context data (name etc)
* Navigation within outlet
* Hide element if empty link
* External navigation for unknown type
* Build and publish docs
* Typedoc
