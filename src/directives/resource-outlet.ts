import {
    Input,
    Output,
    EventEmitter,
    Component,
} from '@angular/core';


@Component({
    selector: 'resource-outlet',
    template: `<template [resourceData] (urlChange)="src=$event" [resourceDataOf]="src">
    <resource-view [data]="data"></resource-view>
</template>`
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
