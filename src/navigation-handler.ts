// TODO null?
export type UrlType = string | null;

export interface NavigationHandler {
  url: UrlType;

  go(url: string): void;
}

export function supportsNavigation(obj: any): obj is NavigationHandler {
  return obj && typeof obj.go === 'function';
}
