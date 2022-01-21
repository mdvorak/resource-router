/**
 * Interface that serves as read-only accessor to the {@link HttpHeaders}.
 * Also allows easy custom implementation and decouples it from HTTP.
 *
 * Empty header collection is provided in the {@link NO_HEADERS}.
 */
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
   * Returns the names of the headers.
   */
  keys(): string[];

  /**
   * Returns list of header values for a given name.
   */
  getAll(name: string): string[] | null;
}

/**
 * Dummy implementation of {@link ReadOnlyHeaders} that never returns anything.
 */
export const NO_HEADERS: ReadOnlyHeaders = {
  has: (name: string): boolean => false,

  get: (name: string): string | null => null,

  keys: (): string[] => [],

  getAll: (name: string): string[] | null => null
};
