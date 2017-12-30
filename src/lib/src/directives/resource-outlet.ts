import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'resource-outlet',
  template: `
    <ng-template [resourceData] let-data [resourceDataOf]="src" (urlChange)="src=$event">
      <resource-view [data]="data"></resource-view>
    </ng-template>`
})
export class ResourceOutletComponent {

  @Output()
  srcChange: EventEmitter<string> = new EventEmitter();

  private srcValue = '';

  @Input()
  set src(value: string) {
    // This is needed check, since during runtime binding, we cannot be sure value isn't null
    if (!value) {
      value = '';
    }

    // Emit event if value has actually changed
    if (this.srcValue !== value) {
      this.srcValue = value;
      this.srcChange.emit(value);
    }
  }

  get src(): string {
    return this.srcValue;
  }
}
