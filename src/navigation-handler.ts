// TODO null?
export type UrlType = string|null;

export interface NavigationHandler {
  url: UrlType;
  go(url: string): void;
}
