import {
  ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, ReflectiveInjector, SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { ViewData } from '../view-data';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedView } from '../activated-view';

class ResourceViewContext<T> {

  constructor(public component: ComponentRef<any>,
              public data: BehaviorSubject<ViewData<T>>) {
  }

  get componentType() {
    return this.component.componentType;
  }

  next(value: ViewData<T>) {
    this.data.next(value);
  }
}

@Directive({
  selector: 'resource-view'
})
export class ResourceViewDirective implements OnChanges {
  @Input()
  public data?: ViewData<any>;

  private current: ResourceViewContext<any> | null = null;

  constructor(private viewContainer: ViewContainerRef,
              private resolver: ComponentFactoryResolver) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Ignore other changes
    if (!changes['data']) {
      return;
    }

    // Show nothing when there is nothing to show
    if (!this.data || !this.data.config || !this.data.config.component) {
      this.destroy();
      return;
    }

    // Is this same component as currently visible?
    if (this.current && this.data.config.component === this.current.componentType) {
      // Propagate new value instead of component recreation
      this.current.next(this.data);
    } else {
      // Display new component (destroys old one)
      this.render();
    }
  }

  destroy() {
    if (this.current) {
      this.current.component.destroy();
      this.current = null;
    }
  }

  render() {
    // Destroy current view
    this.destroy();

    // Ignore when there is nothing to render
    if (!this.data || !this.data.config || !this.data.config.component) {
      return;
    }

    // Prepare data observable
    const dataObservable = new BehaviorSubject<ViewData<any>>(this.data);

    // Create component
    const factory = this.resolver.resolveComponentFactory(this.data.config.component);
    const providers = ReflectiveInjector.resolve([
      {
        provide: ActivatedView,
        useValue: new ActivatedView<any>(this.data.source, dataObservable)
      }
    ]);
    const injector = ReflectiveInjector.fromResolvedProviders(providers, this.viewContainer.parentInjector);
    const component = this.viewContainer.createComponent(factory, this.viewContainer.length, injector, []);

    // Store reference
    this.current = new ResourceViewContext<any>(component, dataObservable);
  }
}
