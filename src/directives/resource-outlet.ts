import {
    Input,
    Output,
    EventEmitter,
    Component,
} from '@angular/core';


@Component({
    selector: 'resource-outlet',
    template: `<resource-view *resourceData="let data of src" 
                              (resourceUrlChange)="src=$event"
                              [data]="data"></resource-view>`
})
export class ResourceOutletDirective {

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
