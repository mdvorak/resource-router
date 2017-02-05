export interface NavigationHandler {
    go(url: string): void;
}

export const NULL_NAVIGATION_HANDLER = {
    go(url: string): void {
    }
};
