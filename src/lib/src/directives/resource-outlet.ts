import { Component, EventEmitter, Host, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ResourceData } from '../resource-data';
import { ISubscription } from 'rxjs/Subscription';
import { Navigable } from '../navigable';


@Component({
  selector: 'resource-outlet',
  template: `
    <resource-view [data]="resource.data" [root]="root"></resource-view>`,
  providers: [ResourceData]
})
export class ResourceOutletComponent implements OnInit, OnDestroy {

  @Input()
  root?: Navigable;
  @Output()
  public readonly srcChange = new EventEmitter<string>();
  private subscription: ISubscription;

  constructor(@Host() public readonly resource: ResourceData) {
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
