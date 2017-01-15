resource-router
===================

[Angular](https://angular.io/) routing engine that drive views by media types. It loads data itself, and by response `Content-Type` header
it displays configured view. It is drop-in replacement for original [Angular Router](https://angular.io/docs/ts/latest/guide/router.html) (they cannot be used at the same time).

The aim of this framework is to allow building of RESTful clients using angular, following [HATEOAS](http://en.wikipedia.org/wiki/HATEOAS) principle.

TODO

Installation
------------

TODO

How It Works
------------
TODO

demo

Configuration
-------------

Both HTML 5 mode and hashbang are supported.

TODO

TODO
----

Things that are yet to be implemented

* Complete README
* Support view matching by HTTP status codes
* Rewrite DEMO
* Support for `resolve` and `data` route configs
* Support for outlet layouts, outlet resolve
* Navigation within outlet
* Hide element if empty link
* External navigation for unknown type
* Build and publish docs
* Travis integration
* Examples