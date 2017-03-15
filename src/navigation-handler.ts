export type UrlType = string|null;

export interface NavigationHandler {
    url: UrlType;
    go(url: string): void;
}

export const NULL_NAVIGATION_HANDLER = {

    set url(url: UrlType) {
    },

    get url(): UrlType {
        return null;
    },

    go(url: string): void {
    }
};
