import { FactoryProvider, Inject, InjectionToken, Optional, Self, SkipSelf } from '@angular/core';

export interface Navigable {

  go(url: string): void;
}

/**
 * Safe-cast function for {@link Navigable} instances.
 * Returns `true` if `obj` is {@link Navigable}.
 */
export const isNavigable = (obj: any): obj is Navigable => obj && typeof obj.go === 'function';

/**
 * Injectable reference to {@link Navigable}.
 * Note that this doesn't have to be immutable class.
 */
export abstract class NavigableRef {

  /**
   * The actual {@link Navigable} instance.
   *
   * Note that since this class is not immutable by definition, there is no guarantee its value won't change.
   * Therefore its recommended to always keep the {@link NavigableRef} instance instead of dereferencing it.
   */
  abstract get navigable(): Navigable;
}

class NavigableRefImpl extends NavigableRef {

  constructor(readonly navigable: Navigable) {
    super();
  }
}

/**
 * Creates immutable {@link NavigableRef} instance from given value.
 */
export const makeNavigableRef = (value: Navigable): NavigableRef => new NavigableRefImpl(value);

/**
 * Token for top-level (root) {@link NavigableRef} instance.
 *
 * To provide it in your component, you might use {@link topLevelNavigableRef}, however see its docs for proper usage.
 */
export const TOP_LEVEL_NAVIGABLE = new InjectionToken<NavigableRef>('TOP_LEVEL_NAVIGABLE');


/**
 * Provides {@link TOP_LEVEL_NAVIGABLE} reference. It honors existing instance, therefore its safe to declare it
 * in the nested components.
 * When there is no existing top-level reference available, current {@link NavigableRef} is used.
 *
 * Note that this requires {@link NavigableRef} to be provided by current component, regardless it being used or not.
 *
 * @see TOP_LEVEL_NAVIGABLE
 * @see NavigationRef
 * @see resourceDataNavigableRef
 */
export const topLevelNavigableRef = (): FactoryProvider => ({
    provide: TOP_LEVEL_NAVIGABLE,
    useFactory: topLevelNavigableFactory,
    deps: [
      [NavigableRef, new Self()],
      [new Inject(TOP_LEVEL_NAVIGABLE), new SkipSelf(), new Optional()]
    ]
  });

/**
 * @internal
 * @see topLevelNavigableRef
 */
export const topLevelNavigableFactory = (current: NavigableRef, existing?: NavigableRef): NavigableRef => existing || current;
