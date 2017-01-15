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
import { Observable } from 'rxjs';
import { RouteDataLoader, LoadedRouteData } from '../route-data-loader';
import { RouteData } from '../route-data';


// TODO support "layouts" via directive contents
// TODO add event "navigated"
// TODO support navigation inside outlet

@Directive({
    selector: 'resource-outlet'
})
export class ResourceOutletDirective {

    @Output() srcChange: EventEmitter<string> = new EventEmitter();
    protected current: ComponentRef<any>;
    private srcValue: string;

    constructor(protected viewContainer: ViewContainerRef,
                protected loader: RouteDataLoader,
                protected resolver: ComponentFactoryResolver) {
        // Handle src changes
        this.srcChange
            .switchMap((url: string) => this.load(url))
            .subscribe(data => this.render(data));
    }

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

    load(url: string): Observable<LoadedRouteData> {
        return this.loader.fetch(url);
    }

    render(routeData: LoadedRouteData) {
        // Destroy current view
        if (this.current) {
            this.current.destroy();
            this.current = null;
        }

        if (routeData.component) {
            // Create nested component
            const factory = this.resolver.resolveComponentFactory(routeData.component);
            const providers = ReflectiveInjector.resolve([
                {
                    provide: RouteData,
                    useValue: new RouteData(routeData.response, routeData.type, routeData.data)
                }
            ]);

            const injector = ReflectiveInjector.fromResolvedProviders(providers, this.viewContainer.parentInjector);

            this.current = this.viewContainer.createComponent(factory, this.viewContainer.length, injector, []);
            this.current.changeDetectorRef.detectChanges(); // TODO what it does? its in RouterOutlet
        }
    }
}
