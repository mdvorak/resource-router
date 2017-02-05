import {
    Input,
    Output,
    EventEmitter,
    Directive,
    ViewContainerRef,
    ComponentRef,
    ReflectiveInjector,
    ComponentFactoryResolver
} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { ViewDataLoader } from '../view-data-loader';
import { ViewData } from '../view-data';

@Directive({
    selector: 'resource-view'
})
export class ResourceViewDirective {

    @Output() dataChange: EventEmitter<ViewData<any>> = new EventEmitter();
    protected current: ComponentRef<any>;
    private dataValue: ViewData<any>;

    constructor(protected viewContainer: ViewContainerRef,
                protected loader: ViewDataLoader,
                protected resolver: ComponentFactoryResolver) {
        // Handle src changes
        this.dataChange
            .subscribe((data: ViewData<any>) => this.render(data));
    }

    @Input()
    set data(value: ViewData<any>) {
        if (this.dataValue !== value) {
            this.dataValue = value;
            this.dataChange.emit(value);
        }
    }

    render(viewData: ViewData<any>) {
        // Destroy current view
        if (this.current) {
            this.current.destroy();
            this.current = null;
        }

        if (viewData && viewData.component) {
            // Create nested component
            const factory = this.resolver.resolveComponentFactory(viewData.component);
            const providers = ReflectiveInjector.resolve([
                {
                    provide: ViewData,
                    useValue: viewData
                }
            ]);

            const injector = ReflectiveInjector.fromResolvedProviders(providers, this.viewContainer.parentInjector);

            this.current = this.viewContainer.createComponent(factory, this.viewContainer.length, injector, []);
            // this.current.changeDetectorRef.detectChanges(); // TODO what it does? its in RouterOutlet
        } else {
            throw new Error('viewData.component cannot be undefined (response=' + viewData.response + ')');
        }
    }
}
