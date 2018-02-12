import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiLocation, bindUrl, ResourceData } from '../lib/src';
import { Subscription } from 'rxjs/Subscription';

// TODO asi by to chtelo prejmenovat ResourceData, protoze to nepopisuje, co trida dela - drzi location a aktualni data,
// TODO tedy takovy container - pak se da prejmenovat i ViewData.target

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ResourceData]
})
export class AppComponent implements OnInit, OnDestroy {

  private urlSubscription = Subscription.EMPTY;

  constructor(public apiLocation: ApiLocation,
              public resource: ResourceData) {
  }

  ngOnInit() {
    this.urlSubscription = bindUrl(this.apiLocation, this.resource);
  }

  ngOnDestroy() {
    this.urlSubscription.unsubscribe();
  }
}
