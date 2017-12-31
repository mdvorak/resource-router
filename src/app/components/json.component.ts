import { Component, OnInit } from '@angular/core';
import { ActivatedView } from '../../lib/public_api';

@Component({
  template: `<h2>JSON {{viewData.type}}</h2>
  <pre>{{viewData.body | json}}</pre>

  <a *ngIf="viewData.body?._links?.self as link"
     [resourceLink]="link.href" [type]="link.type" target="_self">{{link.title}}</a>

  <button type="button"
          *ngIf="viewData.body?._links?.self as link"
          [resourceLink]="link.href" [target]="view.navigation">
    {{link.title}}
  </button>
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
