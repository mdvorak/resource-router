import { Component, OnInit } from '@angular/core';
import { ActivatedView } from '../activated-view';
import { ViewData } from '../view-data';


/**
 * Default view that is used when no other view has been matched.
 *
 * To replace it, register own view with `*` type nad status (don't forget `responseType`):
 * ```ts
 * ResourceRouterModule.forTypes([
 *   {
 *     component: MyGenericErrorComponent,
 *     status: '*',
 *     type: '*',
 *     responseType: 'text'
 *   }
 * ]);
 * ```
 *
 * If you want to have custom view only for specific content type (e.g. specific defined error), register it as follows:
 * ```ts
 * ResourceRouterModule.forTypes([
 *   {
 *     component: MyApiErrorComponent,
 *     status: '*',
 *     type: 'application/vnd.company.error',
 *     responseType: 'json'
 *   }
 * ]);
 * ```
 * Note: since `responseType: 'json'` is default, it can be omitted.
 *
 * Both above views can co-exist - when well-defined error is received, `MyApiErrorComponent` is used,
 * and for unexpected there is `MyGenericErrorComponent`.
 */
@Component({
  templateUrl: './default-error.component.html'
})
export class DefaultErrorComponent implements OnInit {

  data: ViewData<any> = {} as ViewData<any>;

  get html() {
    return this.data.type === 'text/html';
  }

  get object() {
    return typeof this.data.body === 'object';
  }

  constructor(public view: ActivatedView<any>) {
  }

  ngOnInit(): void {
    this.view.data.subscribe(data => this.data = data);
  }
}
