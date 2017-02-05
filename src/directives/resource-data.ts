import {
    Input,
    Output,
    EventEmitter,
    Directive,
    ViewContainerRef,
    TemplateRef,
    OnInit
} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs';
import { ViewDataLoader } from '../view-data-loader';
import { ViewData } from '../view-data';


const UNDEFINED_VIEW = new ViewData(null, null, null, null);


@Directive({
    selector: '[resourceData][[resourceDataOf]'
})
export class ResourceDataDirective implements OnInit {

    @Output() resourceUrlChange: EventEmitter<string> = new EventEmitter();
    private resourceUrlValue: string;
    private context = new ResourceDataContext();

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
                .fetch(url)
                .catch(err => Observable.of(UNDEFINED_VIEW));
        } else {
            return Observable.of(UNDEFINED_VIEW);
        }
    }

    ngOnInit() {
        this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    }
}

export class ResourceDataContext {
    $implicit: ViewData<any> = UNDEFINED_VIEW;
}
