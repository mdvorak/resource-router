import { Component } from '@angular/core';
import { ApiLocation } from 'angular-resource-router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(public apiLocation: ApiLocation) {
  }
}
