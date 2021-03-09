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
import { BehaviorSubject, from, isObservable, Observable, of } from 'rxjs';
import { ViewData } from '../view-data';
import { ActivatedView } from '../activated-view';
import { Navigable, NavigableRef } from '../navigable';
import { Resolve } from '../resolve';
import { ResolveData } from '../view-definition';
import { isPromise } from 'rxjs/internal-compatibility';
import { mergeMap, takeLast, tap } from 'rxjs/operators';

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

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    // Show nothing when there is nothing to show
    if (!this.data || !this.data.config || !this.data.config.component) {
      this.destroy();
      return;
    }

    await this.runResolve(this.data.config.resolve)
      .then(resolveData => {
        const keys = Object.keys(resolveData);
        keys.forEach(k => {
          if (this.data) {
            this.data.resolve[k] = resolveData[k];
          }
        });
      });

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

    const injector = Injector.create({ providers: providers, parent: this.viewContainer.injector });
    const component = this.viewContainer.createComponent(factory, this.viewContainer.length, injector, []);

    // Store reference
    this.current = new ResourceViewContext<any>(component, target, dataSource);
  }

  runResolve(resolve: ResolveData | undefined): Promise<ResolveData> {
    if (!resolve) {
      return of({}).toPromise();
    }
    const keys = Object.keys(resolve);
    if (keys.length === 0) {
      return of({}).toPromise();
    }
    const resolveOut: ResolveData = {};
    return from(keys)
      .pipe(
        mergeMap(
          (key: string) => this.doResolve(resolve[key])
            .pipe(tap((value: any) => resolveOut[key] = value))),
        takeLast(1),
        mergeMap(() => {
          if (Object.keys(resolveOut).length === keys.length) {
            return of(resolveOut);
          } else {
            return of({});
          }
        })
      ).toPromise();
  }

  doResolve(resolve: any): Observable<any> {
    if (resolve) {
      resolve = this.viewContainer.injector.get<Resolve>(resolve);
      if (isResolve(resolve) && this.data) {
        return this.wrapIntoObservable(resolve.resolve(this.data.body, this.data.headers, this.data.status));
      }
    }
    return of({});
  }

  wrapIntoObservable(v: any | Promise<any> | Observable<any>): Observable<any> {
    if (isObservable(v)) {
      return v;
    } else if (isPromise(v)) {
      return from(Promise.resolve(v));
    } else {
      return of(v);
    }
  }
}

export function isResolve(r: any): r is Resolve {
  return r && typeof r.resolve === 'function';
}
