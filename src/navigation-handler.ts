export interface NavigationHandler {
    url: string;
    go(url: string): void;
}

export const NULL_NAVIGATION_HANDLER = {

    set url(url: string) {
    },

    get url(): string {
        return null;
    },

    go(url: string): void {
    }
};
