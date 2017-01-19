resource-router
===================

[Angular](https://angular.io/) routing engine that drive views by media types. It loads data itself, and by response `Content-Type` header
it displays configured view. It is drop-in replacement for original [Angular Router](https://angular.io/docs/ts/latest/guide/router.html) (they cannot be used at the same time).

The aim of this framework is to allow building of RESTful clients using angular, following [HATEOAS](http://en.wikipedia.org/wiki/HATEOAS) principle.

TODO

Installation
------------

    npm i angular-resource-router


Configuration
-------------

Sample snippet how is the router configured.
It is very similar to original router, but instead of registering paths, we are registering media types.

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ResourceRouterModule } from 'angular-data-router';
import { AppComponent } from './app.component';
import { ExampleComponent } from './example.component';

@NgModule({
    declarations: [
        AppComponent,
        ExampleComponent
    ],
    imports: [
        BrowserModule,
        ResourceRouterModule.configure({
            prefix: 'api/'
        }),
        ResourceRouterModule.forTypes([
            {
                type: 'application/x.example',
                component: ExampleComponent
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

How It Works
------------
TODO


TODO
----

Things that are yet to be implemented

* Complete README
* Support view matching by HTTP status codes
* Complete example and make it available online
* Support for `resolve` and `data` route configs
* Support for outlet layouts, outlet resolve
* Navigation within outlet
* Hide element if empty link
* External navigation for unknown type
* Build and publish docs
* Travis integration
