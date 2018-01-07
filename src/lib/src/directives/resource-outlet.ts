import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ResourceData } from '../resource-data';
import { ISubscription } from 'rxjs/Subscription';


@Component({
  selector: 'resource-outlet',
  template: `
    <resource-view [data]="resource.data"></resource-view>`,
  providers: [ResourceData]
})
export class ResourceOutletComponent implements OnInit, OnDestroy {

  @Output()
  public readonly srcChange = new EventEmitter<string>();
  private subscription: ISubscription;

  constructor(public readonly resource: ResourceData) {
  }

  ngOnInit(): void {
    this.subscription = this.resource.urlChange.subscribe((value: string) => this.srcChange.emit(value));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get src(): string {
    return this.resource.url;
  }

  @Input()
  set src(value: string) {
    this.resource.url = value;
  }
}
