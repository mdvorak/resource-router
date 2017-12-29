export interface NavigationHandler {
  url: string;

  go(url: string): void;
}

export function supportsNavigation(obj: any): obj is NavigationHandler {
  return obj && typeof obj.go === 'function';
}
