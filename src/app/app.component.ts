import { Component } from '@angular/core';
import { ApiLocation } from 'angular-resource-router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Tour of Heroes';

  constructor(public apiLocation: ApiLocation) {
  }
}
