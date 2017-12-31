export interface Navigable {
  url: string;

  navigate(url: string): void;
}

export function supportsNavigation(obj: any): obj is Navigable {
  return obj && typeof obj.navigate === 'function';
}
