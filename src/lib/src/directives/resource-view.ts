import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Injector,
  Input,
  OnChanges,
  Optional,
  SimpleChanges,
  StaticProvider,
  ViewContainerRef
} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { ViewData } from '../view-data';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedView } from '../activated-view';
import { Navigable, NavigableRef } from '../navigable';

class ResourceViewContext<T> {

  constructor(public readonly component: ComponentRef<any>,
              public readonly target: Navigable,
              public readonly data: BehaviorSubject<ViewData<T>>) {
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
  data?: ViewData<any>;

  private current: ResourceViewContext<any> | null = null;

  constructor(private readonly viewContainer: ViewContainerRef,
              private readonly resolver: ComponentFactoryResolver,
              @Optional() private readonly navigableRef?: NavigableRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Show nothing when there is nothing to show
    if (!this.data || !this.data.config || !this.data.config.component) {
      this.destroy();
      return;
    }

    // Is this same component as currently visible?
    if (this.current
      && this.data.config.component === this.current.componentType
      // Note: data.target won't change during normal use
      && this.data.target === this.current.target) {
      // Propagate new value instead of component re-creation
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
    const dataSource = new BehaviorSubject<ViewData<any>>(this.data);
    const target = this.data.target;

    // Create component
    const factory = this.resolver.resolveComponentFactory(this.data.config.component);
    const providers: StaticProvider[] = [
      {
        provide: ActivatedView,
        useValue: new ActivatedView<any>(target, dataSource)
      }
    ];

    const injector = Injector.create({providers: providers, parent: this.viewContainer.parentInjector});
    const component = this.viewContainer.createComponent(factory, this.viewContainer.length, injector, []);

    // Store reference
    this.current = new ResourceViewContext<any>(component, target, dataSource);
  }
}
