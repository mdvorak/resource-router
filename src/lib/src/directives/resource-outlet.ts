import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ResourceData } from '../resource-data';
import { ISubscription } from 'rxjs/Subscription';


@Component({
  selector: 'resource-outlet',
  template: `
    <ng-template [resourceData] let-data [resourceDataOf]="src" (urlChange)="src=$event">
      <resource-view [data]="data"></resource-view>
    </ng-template>`,
  providers: [ResourceData]
})
export class ResourceOutletComponent implements OnInit, OnDestroy {

  @Output()
  public readonly srcChange = new EventEmitter<string>();
  private subscription: ISubscription;

  constructor(private readonly resourceData: ResourceData) {
  }

  ngOnInit(): void {
    this.subscription = this.resourceData.urlChange.subscribe((value: string) => this.srcChange.emit(value));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @Input()
  set src(value: string) {
    this.resourceData.url = value;
  }

  get src(): string {
    return this.resourceData.url;
  }
}
