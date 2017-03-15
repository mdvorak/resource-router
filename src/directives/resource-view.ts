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

    protected current: ComponentRef<any>|null;
    private dataValue: ViewData<any>;

    constructor(protected viewContainer: ViewContainerRef,
                protected resolver: ComponentFactoryResolver) {
    }

    @Input()
    set data(value: ViewData<any>) {
        if (this.dataValue !== value) {
            this.dataValue = value;
            this.render(value);
        }
    }

    render(viewData: ViewData<any>) {
        // Destroy current view
        if (this.current) {
            this.current.destroy();
            this.current = null;
        }

        if (viewData && viewData.config && viewData.config.component) {
            // Create nested component
            const factory = this.resolver.resolveComponentFactory(viewData.config.component);
            const providers = ReflectiveInjector.resolve([
                {
                    provide: ViewData,
                    useValue: viewData
                }
            ]);

            const injector = ReflectiveInjector.fromResolvedProviders(providers, this.viewContainer.parentInjector);
            this.current = this.viewContainer.createComponent(factory, this.viewContainer.length, injector, []);
        }
    }
}
