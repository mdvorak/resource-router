import { Compiler, Inject, Injectable, InjectFlags, InjectionToken, Injector, NgModuleFactory, Optional } from '@angular/core';
import { ViewDef } from './view-definition';
import { SortedArray } from './utils/sorted-array';
import { wildcardToRegex } from './utils/wildcard-to-regex';
import { simpleTypeQualityEvaluator, statusQualityEvaluator, TypeQualityEvaluator } from './quality-evaluator';
import { wrapIntoObservable } from './utils/wrapers';
import { map, mergeMap } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { LoadChildrenCallback } from '@angular/router';


export const RESOURCE_VIEWS = new InjectionToken<ViewDef>('RESOURCE_VIEWS');
export const TYPE_QUALITY_EVALUATOR = new InjectionToken<TypeQualityEvaluator>('TYPE_QUALITY_EVALUATOR');


// Private classes
/**
 * @internal
 */
class ViewsByStatus {
  readonly status: string;
  readonly statusExp: RegExp;
  readonly quality: number;
  readonly types = new SortedArray<ParsedViewDef>(qualityComparator);
  readonly modules = new SortedArray<ParsedViewDef>(qualityComparator);

  constructor(status: string) {
    this.status = status;
    this.statusExp = wildcardToRegex(status);
    this.quality = statusQualityEvaluator(status);
  }
}

/**
 * @internal
 */
interface ParsedViewDef {
  readonly config: ViewDef;
  readonly quality: number;
  readonly typeExp: RegExp;
}


// Public class
@Injectable()
export class ResourceViewRegistry {

  private readonly typeQualityEvaluator: TypeQualityEvaluator;
  private readonly viewsByStatus = new SortedArray<ViewsByStatus>(qualityComparator);
  private _length = 0;

  constructor(private compiler: Compiler,
              private injector: Injector,
              @Inject(RESOURCE_VIEWS) @Optional() views?: any,
              @Inject(TYPE_QUALITY_EVALUATOR) @Optional() typeQualityEvaluator?: TypeQualityEvaluator) {
    // Initialize quality evaluator - must be before addViews
    this.typeQualityEvaluator = typeQualityEvaluator || simpleTypeQualityEvaluator;

    // Ignore if no view is defined - this is supported path for later registration
    if (views) {
      // Register views
      this.addViews(views);
    }
  }

  get length(): number {
    return this._length;
  }

  match(type: string, status: number): ViewDef | Observable<ViewDef> {
    // Despite status being mandatory, in runtime we still might receive undefined or others, and default error is misleading
    if (typeof status !== 'number') {
      throw new Error(`Wrong status type (${typeof status}), no view can be matched`);
    }

    // Convert number to padded string
    const statusStr = normalizeStatus(status);

    // Find all matching groups by status
    for (let i = 0, a = this.viewsByStatus.array, l = a.length; i < l; i++) {
      const group = a[i];

      // Match
      if (!group.statusExp.test(statusStr)) {
        continue;
      }

      // Find view in the group
      let view = group.types.array.find(v => v.typeExp.test(type));
      if (view) {
        return view.config;
      }
      view = group.modules.array.find(v => v.typeExp.test(type));
      if (view && view.config.loadChildren != null) {
        return this.loadChildComponents(view.config.loadChildren)
          .pipe(
            mergeMap(() => wrapIntoObservable(this.match(type, status)))
          );
      }
    }

    // Not found
    throw new Error(`No view definition found for type '${type}' and status '${statusStr}' - please register default view`);
  }

  addViews(config: ViewDef | ViewDef[]) {
    // Flatten array
    if (Array.isArray(config)) {
      // Recursive call
      config.forEach(this.addViews, this);
    } else if (config) {
      // Single view
      this.addView(config);
    }
  }

  protected addView(config: ViewDef) {
    // Sanity check
    this.validateViewDefinition(config);

    // All permutations of status and type
    toArray(config.status || '2??').forEach(status => {
      // Get status group
      const normalizedStatus = normalizeStatusExpression('' + status);
      const group = this.getViewsByStatus(normalizedStatus);

      // Types
      toArray(config.type).forEach(type => {
        this.addSingleView(config, group, type);
      });
    });
  }

  //noinspection JSMethodCanBeStatic
  protected validateViewDefinition(config: ViewDef) {
    // Component / LoadChildren
    if (!( config.component || config.loadChildren ) ||
      !( typeof config?.component === 'function' || typeof config?.loadChildren === 'function' )) {
      throw newValidationError(config, 'component / loadChildren is mandatory and must be a type');
    }

    if (config.component && config.loadChildren) {
      throw newValidationError(config, 'component and loadChildren cannot be together');
    }

    // Type
    validateType(config);

    // Status
    validateStatus(config);

    // Quality
    if (config.quality && typeof config.quality !== 'number') {
      throw newValidationError(config, 'quality must be a number');
    }
  }

  private addSingleView(config: ViewDef, group: ViewsByStatus, type: string) {
    // Copy of definition, with specific status and type only
    // See https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#object-spread-and-rest
    config = {
      ...config, ...{
        status: group.status,
        type: type
      }
    };

    // Evaluate quality if needed
    const quality = typeof config.quality === 'number' ? config.quality : this.typeQualityEvaluator(type);

    if (config.component != null) {
      // Add to the group
      group.types.push({
        config: Object.freeze(config),
        typeExp: wildcardToRegex(type),
        quality: quality
      });
    } else if (config.loadChildren != null) {
      group.modules.push({
        config: Object.freeze(config),
        typeExp: wildcardToRegex(type),
        quality: quality
      });
    } else {
      throw new Error('Cant load components/modules. Excepted defined component or loadChildren');
    }

    // Increment count
    this._length++;
  }

  private getViewsByStatus(status: string) {
    let byStatus = this.viewsByStatus.array.find(s => s.status === status);

    if (!byStatus) {
      byStatus = new ViewsByStatus(status);
      this.viewsByStatus.push(byStatus);
    }

    return byStatus;
  }

  private loadChildComponents(loadChildren: LoadChildrenCallback): Observable<void> {
    return this.loadModuleFactory(loadChildren).pipe(
      map((factory: NgModuleFactory<any>) =>
        this.addViews(factory.create(this.injector)
          .injector.get<ViewDef[]>(RESOURCE_VIEWS, undefined, InjectFlags.Self || InjectFlags.Optional))
      )
    );
  }

  private loadModuleFactory(loadChildren: LoadChildrenCallback): Observable<NgModuleFactory<any>> {
    return wrapIntoObservable(loadChildren())
      .pipe(mergeMap((module: any) => {
        if (module instanceof NgModuleFactory) {
          return of(module);
        } else {
          return from(this.compiler.compileModuleAsync(module));
        }
      }));
  }
}


// Validation functions
/**
 * @internal
 */
function validateType(config: ViewDef) {
  if (Array.isArray(config.type)) {
    if (config.type.find(t => typeof t !== 'string')) {
      throw newValidationError(config, 'type array must consist only of strings');
    }
  } else if (typeof config.type !== 'string') {
    throw newValidationError(config, 'type must be a string or array of strings');
  }
}

/**
 * @internal
 */
function validateStatus(config: ViewDef) {
  if (config.status) {
    if (Array.isArray(config.status)) {
      // Validate array of values
      config.status.forEach(status => validateStatusExpression(config, '' + status));
    } else if (typeof config.status === 'string' || typeof config.status === 'number') {
      // Validate single value
      validateStatusExpression(config, '' + config.status);
    } else {
      // Invalid
      throw newValidationError(config, 'status must be either string, number or array of them');
    }
  }
}

/**
 * @internal
 */
function validateStatusExpression(config: ViewDef, status: string) {
  if (status.length < 1 || status.length > 3) {
    throw newValidationError(config, 'status pattern must be between 1 and 3 characters long');
  }

  if (/[^x\d?*]/.test(status)) {
    throw newValidationError(config, 'status pattern contains invalid characters');
  }

  if (!/^\d*[?x]*\**$/.test(status)) {
    throw newValidationError(config, 'status pattern can contain wildcards only at the end of the pattern');
  }
}

/**
 * @internal
 */
function newValidationError(config: any, text: string): Error {
  return new Error('Invalid view configuration, ' + text + ':\n' + JSON.stringify(config));
}

// Utils
/**
 * @internal
 */
export function normalizeStatusExpression(pattern: string): string {
  // Handle * wildcard
  if (pattern.endsWith('*')) {
    if (pattern.length > 3) {
      throw new Error('Wildcard * is not supported for status expressions longer then 3 characters: ' + pattern);
    }

    return (pattern.replace(/\*/g, '') + '???').substr(0, 3);
  }

  // Replace x to ?
  pattern = pattern.replace(/x/g, '?');

  // Pad left with zeroes
  return pattern.length < 3 ? ('000' + pattern).substr(-3) : pattern;
}

/**
 * @internal
 */
export function normalizeStatus(status: number): string {
  // Pad left with zeroes
  return status < 100 ? ('000' + status).substr(-3) : '' + status;
}

/**
 * @internal
 */
function qualityComparator(a: { quality: number }, b: { quality: number }) {
  if (a.quality === b.quality) {
    return 0;
  }
  return a.quality < b.quality ? 1 : -1;
}

/**
 * Returns value if it is array, otherwise it wraps the value in the array.
 *
 * @param value Single value or array of values.
 * @returns Array or values.
 * @internal
 */
function toArray<T>(value: T | T[]): Array<T> {
  return Array.isArray(value) ? value as T[] : [value] as T[];
}
