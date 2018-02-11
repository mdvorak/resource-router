import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  Optional,
  ReflectiveInjector,
  SimpleChanges,
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
  @Input()
  root?: Navigable;

  private current: ResourceViewContext<any> | null = null;

  constructor(private readonly viewContainer: ViewContainerRef,
              private readonly resolver: ComponentFactoryResolver,
              @Optional() private readonly navigableRef?: NavigableRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Ignore other changes
    // TODO pri zmene top je treba take neco delat
    // if (!changes['data']) {
    //   return;
    // }

    // Show nothing when there is nothing to show
    if (!this.data || !this.data.config || !this.data.config.component) {
      this.destroy();
      return;
    }

    // Is this same component as currently visible?
    if (this.current
      && this.data.config.component === this.current.componentType
      && this.data.target === this.current.target
      // TODO tohle tu urcite nechceme
      && !changes['top']) {
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
    const dataSource = new BehaviorSubject<ViewData<any>>(this.data);
    const target = this.data.target;

    // Create component
    const factory = this.resolver.resolveComponentFactory(this.data.config.component);
    const providers = ReflectiveInjector.resolve([
      {
        provide: ActivatedView,
        useValue: new ActivatedView<any>(target, dataSource)
      },
      {
        provide: NavigableRef,
        useValue: new NavigableRef(target, this.root || (this.navigableRef ? this.navigableRef.root : undefined))
      },
    ]);
    const injector = ReflectiveInjector.fromResolvedProviders(providers, this.viewContainer.parentInjector);
    const component = this.viewContainer.createComponent(factory, this.viewContainer.length, injector, []);

    // Store reference
    this.current = new ResourceViewContext<any>(component, target, dataSource);
  }
}
