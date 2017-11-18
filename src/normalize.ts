const MEDIA_TYPE_NORMALIZER = /\s*[+;].*$/;

/**
 * Normalizes the media type. Removes format suffix (everything after +), and prepends `application/` if there is
 * just subtype provided.
 *
 * @param mimeType Media type to match.
 * @returns Normalized media type.
 */
export function normalizeMediaType(mimeType: string): string {
  // Get rid of + end everything after
  return mimeType ? mimeType.replace(MEDIA_TYPE_NORMALIZER, '') : mimeType;
}
