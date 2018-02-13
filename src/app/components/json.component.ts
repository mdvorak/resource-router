import { Component, OnInit } from '@angular/core';
import { ActivatedView } from '../../lib/public_api';

@Component({
  template: `<h2>JSON {{viewData.type}}</h2>
  <pre>{{viewData.body | json}}</pre>

  <a *ngIf="viewData.body?._links?.self as link"
     [resourceLink]="link.href" [type]="link.type" target="_self">{{link.title}} (_self)</a>

  <button type="button"
          *ngIf="viewData.body?._links?.self as link"
          [resourceLink]="link.href" target="_top">
    {{link.title}} (_top)
  </button>

  <div>
    <a [resourceLink]="view.snapshot.url + '/246'">/246 (default)</a>
    <a [resourceLink]="view.snapshot.url + '/..'">/.. (default)</a>
  </div>

  <div>
    <a [resourceLink]="view.snapshot.url + '/246'" target="_self">/246 (_self)</a>
    <a [resourceLink]="view.snapshot.url + '/..'" target="_self">/.. (_self)</a>
  </div>

  <div *resourceData="let nested of view.snapshot.url + '/246'" [resourceContext]="nested">
    <h2>NESTED {{nested.target.id}}</h2>
    <resource-view [data]="nested"></resource-view>
  </div>
  `
})
export class JsonComponent implements OnInit {

  viewData: any;

  constructor(public view: ActivatedView<any>) {
  }

  ngOnInit(): void {
    this.view.data.subscribe(data => this.viewData = data);
  }
}
