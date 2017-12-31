export interface ReadOnlyHeaders {
  /**
   * Checks for existence of header by given name.
   */
  has(name: string): boolean;

  /**
   * Returns first header that matches given name.
   */
  get(name: string): string | null;

  /**
   * Returns the names of the headers
   */
  keys(): string[];

  /**
   * Returns list of header values for a given name.
   */
  getAll(name: string): string[] | null;
}

/**
 * Dummy implementation of ReadOnlyHeaders that never returns anything.
 */
export const NO_HEADERS: ReadOnlyHeaders = {
  has(name: string): boolean {
    return false;
  },

  get(name: string): string | null {
    return null;
  },

  keys(): string[] {
    return [];
  },

  getAll(name: string): string[] | null {
    return null;
  }
};
