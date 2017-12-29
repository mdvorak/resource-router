import { Component } from '@angular/core';
import { ViewData } from '../../lib/public_api';


export interface SampleData {

  _links?: any;

  name: string;
  address?: string;
  age?: number;
}


@Component({
  template: `<h2>SAmple</h2>
  <form *ngIf="data">
    <label for="name">Name</label>
    <input id="name" name="name" type="text" [(ngModel)]="data.name">

    <label for="address">Address</label>
    <input id="address" name="address" type="text" [(ngModel)]="data.address">

    <label for="age">Name</label>
    <input id="age" name="age" type="number" [(ngModel)]="data.age">
  </form>

  <a [resourceLink]="data?._links?.next?.href">{{data?._links?.next?.title}}</a>`
})
export class SampleComponent {

  data?: SampleData;

  constructor(public viewData: ViewData<SampleData>) {
    this.data = viewData.body;
  }
}
