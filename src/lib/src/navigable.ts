import { Injectable } from '@angular/core';

export interface Navigable {

  go(url: string): void;
}

export function isNavigable(obj: any): obj is Navigable {
  return obj && typeof obj.go === 'function';
}

@Injectable()
export class NavigableRef {

  readonly root: Navigable;

  constructor(public readonly value: Navigable, root?: Navigable) {
    this.root = root || value;
  }
}
