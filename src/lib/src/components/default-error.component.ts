import { Component, OnInit } from '@angular/core';
import { ActivatedView } from '../activated-view';
import { ViewData } from '../view-data';

@Component({
  template: `<p>Error loading a view<code *ngIf="data.type"> {{data.type}}</code> on URL <code>{{data.url}}</code>
  <p>{{data.status}} {{data.statusText}}</p>
  <pre *ngIf="data.body">{{data.body}}</pre>`
})
export class DefaultErrorComponent implements OnInit {

  public data: ViewData<any>;

  constructor(public view: ActivatedView<any>) {
  }

  ngOnInit(): void {
    this.view.data.subscribe(data => this.data = data);
  }
}
