import {
    Input,
    Output,
    EventEmitter,
    Directive,
    ViewContainerRef,
    TemplateRef,
    OnInit, ViewRef
} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs';
import { ViewDataLoader } from '../view-data-loader';
import { ViewData } from '../view-data';
import { NavigationHandler } from '../navigation-handler';


@Directive({
    selector: '[resourceData][resourceDataOf]',
    outputs: ['resourceUrlChange']
})
export class ResourceDataDirective implements OnInit, NavigationHandler {

    resourceUrlChange = new EventEmitter<string>();

    private resourceUrlValue: string;
    private undefinedView = new ViewData(this, null, null, null, null);
    private context = new ResourceDataContext(this.undefinedView);

    constructor(protected viewContainer: ViewContainerRef,
                protected templateRef: TemplateRef<ResourceDataContext>,
                protected loader: ViewDataLoader) {
        // Handle src changes
        this.resourceUrlChange
            .switchMap(url => this.load(url))
            .subscribe(data => this.context.$implicit = data);
    }

    // Unused but needed when used in decomposed notation directly on <template>
    @Input()
    set resourceData(value: any) {
    }

    get resourceDataOf(): string {
        return this.resourceUrlValue;
    }

    @Input()
    set resourceDataOf(value: string) {
        if (this.resourceUrlValue !== value) {
            this.resourceUrlValue = value;
            this.resourceUrlChange.emit(value);
        }
    }

    load(url: string): Observable<ViewData<any>> {
        if (url) {
            return this.loader
                .fetch(url, this)
                .catch(err => Observable.of(this.undefinedView));
        } else {
            return Observable.of(this.undefinedView);
        }
    }

    ngOnInit() {
        this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    }

    go(url: string): void {
        this.resourceDataOf = url;
    }
}

export class ResourceDataContext {
    constructor(public $implicit: ViewData<any>) {
    }
}
