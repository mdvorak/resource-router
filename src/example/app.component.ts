import { Component } from '@angular/core';
import { ApiLocation } from '../../public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(public apiLocation: ApiLocation) {
  }
}
