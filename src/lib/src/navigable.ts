export interface Navigable {

  go(url: string): void;
}

export function isNavigable(obj: any): obj is Navigable {
  return obj && typeof obj.go === 'function';
}
