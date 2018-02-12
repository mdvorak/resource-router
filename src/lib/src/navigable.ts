import { FactoryProvider, Inject, Injectable, InjectionToken, Optional, Self, SkipSelf } from '@angular/core';
import { resourceDataNavigableRef } from './resource-data';

export interface Navigable {

  go(url: string): void;
}

/**
 * Safe-cast function for {@link Navigable} instances.
 * Returns `true` if `obj` is {@link Navigable}.
 */
export function isNavigable(obj: any): obj is Navigable {
  return obj && typeof obj.go === 'function';
}

/**
 * Injectable reference to {@link Navigable}.
 * Note that this doesn't have to be immutable class.
 */
@Injectable()
export abstract class NavigableRef {

  /**
   * The actual {@link Navigable} instance.
   *
   * Note that since this class is not immutable by definition, there is no guarantee its value won't change.
   * Therefore its recommended to always keep the {@link NavigableRef} instance instead of dereferencing it.
   */
  abstract get navigable(): Navigable;

  /**
   * Creates immutable {@link NavigableRef} instance from given value.
   */
  static create(value: Navigable): NavigableRef {
    return new NavigableRefImpl(value);
  }
}

class NavigableRefImpl extends NavigableRef {

  constructor(public readonly navigable: Navigable) {
    super();
  }
}

/**
 * Token for root (top-level) {@link NavigableRef} instance.
 *
 * To provide it in your component, you might use {@link rootNavigableRef}, however see its docs for proper usage.
 */
export const ROOT_NAVIGABLE = new InjectionToken<NavigableRef>('ROOT_NAVIGABLE');


/**
 * Provides {@link ROOT_NAVIGABLE} reference. It honors existing root, therefore its safe to declare it
 * in the nested components.
 * When there is no existing root available, current {@link NavigableRef} is used.
 *
 * Note that this requires {@link NavigableRef} to be provided by current component, regardless it being used or not.
 *
 * @see ROOT_NAVIGABLE
 * @see NavigationRef
 * @see resourceDataNavigableRef
 */
export function rootNavigableRef(): FactoryProvider {
  return {
    provide: ROOT_NAVIGABLE,
    useFactory: rootNavigableFactory,
    deps: [
      [NavigableRef, new Self()],
      [new Inject(ROOT_NAVIGABLE), new SkipSelf(), new Optional()]
    ]
  };
}

/**
 * @internal
 * @see rootNavigableRef
 */
export function rootNavigableFactory(current: NavigableRef, root?: NavigableRef): NavigableRef {
  return root || current;
}
