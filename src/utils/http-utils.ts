/**
 * Cross-site scripting prefix. Copied from HttpXhrBackend.
 * @type {RegExp}
 */
const XSSI_PREFIX = /^\)]}',?\n/;

/**
 * Parses text as JSON, removing XSSI prefix, if present.
 * Follows Angular internal JSON handling.
 *
 * @param {string} input Source string.
 * @returns {any} Parsed object.
 */
export function stringToJSON(input: string): any {
  // Attempt the parse. If it fails, a parse error should be delivered to the user.
  input = input.replace(XSSI_PREFIX, '');
  // Note: Parser error is caught outside
  return JSON.parse(input);
}
