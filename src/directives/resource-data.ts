import {
    Input,
    Output,
    EventEmitter,
    Directive,
    ViewContainerRef,
    TemplateRef
} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {Observable} from 'rxjs';
import {ViewDataLoader} from '../view-data-loader';
import {ViewData} from '../view-data';


@Directive({
    selector: '[resourceData][[resourceDataOf]'
})
export class ResourceDataDirective {

    @Output() resourceUrlChange: EventEmitter<string> = new EventEmitter();
    private resourceUrlValue: string;

    constructor(protected viewContainer: ViewContainerRef,
                protected templateRef: TemplateRef<any>,
                protected loader: ViewDataLoader) {
        // Handle src changes
        this.resourceUrlChange
            .switchMap((url: string) => this.load(url))
            .subscribe(
                data => this.render(data),
                err => this.clear()
            );
    }

    // Unused but needed when used in decomposed notation directly on <template>
    @Input()
    set resourceData(value: any) {
    }

    @Input()
    set resourceDataOf(value: string) {
        if (this.resourceUrlValue !== value) {
            this.resourceUrlValue = value;
            this.resourceUrlChange.emit(value);
        }
    }

    load(url: string): Observable<ViewData<any>> {
        return this.loader.fetch(url);
    }

    clear() {
        this.viewContainer.clear();
    }

    render(viewData: ViewData<any>) {
        // Destroy current view
        this.clear();

        // Create new
        this.viewContainer.createEmbeddedView(this.templateRef, {
            $implicit: viewData
        });
    }
}
