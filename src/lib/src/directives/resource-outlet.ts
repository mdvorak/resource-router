import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Self } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ResourceData, resourceDataNavigableRef } from '../resource-data';
import { rootNavigableRef } from '../navigable';


@Component({
  selector: 'resource-outlet',
  template: '<resource-view [data]="resource.data"></resource-view>',
  providers: [
    ResourceData,
    resourceDataNavigableRef(),
    rootNavigableRef()
  ]
})
export class ResourceOutletComponent implements OnInit, OnDestroy {

  @Output()
  public readonly srcChange = new EventEmitter<string>();
  private subscription = Subscription.EMPTY;

  constructor(@Self() public readonly resource: ResourceData) {
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
