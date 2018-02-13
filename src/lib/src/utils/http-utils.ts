/**
 * Cross-site scripting prefix. Copied from HttpXhrBackend.
 */
const XSSI_PREFIX = /^\)]}',?\n/;

/**
 * Parses text as JSON, removing XSSI prefix, if present.
 * Follows Angular internal JSON handling.
 *
 * @param input Source string.
 * @returns Parsed object.
 * @internal
 */
export function stringToJSON(input: string): any {
  // Attempt the parse. If it fails, a parse error should be delivered to the user.
  input = input.replace(XSSI_PREFIX, '');
  // Note: Parser error is caught outside
  return JSON.parse(input);
}
