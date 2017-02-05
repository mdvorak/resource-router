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
    selector: '[resourceData][resourceDataOf]'
})
export class ResourceDataDirective implements OnInit, NavigationHandler {

    @Output() urlChange = new EventEmitter<string>();

    private urlValue: string;
    private undefinedView = new ViewData(this, null, null, null, null);
    private context = new ResourceDataContext(this.undefinedView);

    constructor(protected viewContainer: ViewContainerRef,
                protected templateRef: TemplateRef<ResourceDataContext>,
                protected loader: ViewDataLoader) {
        // Handle src changes
        this.urlChange
            .switchMap(url => this.load(url))
            .subscribe(data => this.context.$implicit = data);
    }

    // Unused but needed when used in decomposed notation directly on <template>
    @Input()
    set resourceData(value: any) {
    }

    @Input()
    set resourceDataOf(value: string) {
        this.url = value;
    }

    get url(): string {
        return this.urlValue;
    }

    set url(value: string) {
        if (this.urlValue !== value) {
            this.urlValue = value;
            this.urlChange.emit(value);
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
        // Always fire the event, which forces the data to be reloaded
        this.urlValue = url;
        this.urlChange.emit(url);
    }
}

export class ResourceDataContext {
    constructor(public $implicit: ViewData<any>) {
    }
}
