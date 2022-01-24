/**
 * Converts wildcard pattern with `?` and `*` characters to regular expression.
 *
 * ## Usage:
 * ```
 * wildcardToRegex('*.js').test('foo.js') == true
 * wildcardToRegex('*.js').test('foo.jsx') == false
 * wildcardToRegex('image/*').test('image/png') == true
 * wildcardToRegex('image/*').test('text/plain') == false
 * ```
 *
 * @param wildcard Wildcard pattern, supports `?` and `*` characters.
 * @returns Compiled RegExp.
 */
export const wildcardToRegex = (wildcard: string): RegExp =>
  new RegExp(
    `^${escapeRegExpPattern(wildcard)
      .replace(/\\\*/g, '.*')
      .replace(/\\\?/g, '.')}$`
  );


/**
 * Converts any string to regular expression, which matches it. Handles special RegExp characters.
 *
 * @param s Any string.
 * @returns Regular expression pattern.
 */
export const escapeRegExpPattern = (s: string): string =>
  s.replace(/([-()\[\]{}+.$^|:#<>!\\=,*?])/g, '\\$1')
    .replace(/\x08/g, '\\x08');

