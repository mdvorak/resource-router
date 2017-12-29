import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'resource-outlet',
  template: `
    <ng-template [resourceData] let-data [resourceDataOf]="src" (urlChange)="src=$event">
      <resource-view [data]="data"></resource-view>
    </ng-template>`
})
export class ResourceOutletComponent {

  @Output() srcChange: EventEmitter<string> = new EventEmitter();
  private srcValue: string;

  @Input()
  set src(value: string) {
    if (this.srcValue !== value) {
      this.srcValue = value;
      this.srcChange.emit(value);
    }
  }

  get src(): string {
    return this.srcValue;
  }
}
