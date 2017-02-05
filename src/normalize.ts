// Intentionally using window.document
const urlParsingNode = document.createElement('A') as HTMLAnchorElement;


/**
 * Normalizes the URL for current page. It takes into account base tag etc.
 *
 * It is browser dependent, and takes into account `<base>` tag or current URL.
 * Note that in HTML5 mode, there should be always specified base tag ending with `/` to get expected behavior.
 *
 * @param href URL to be normalized. Can be absolute, server-relative or context relative.
 *                      <p>If the href is empty string, base href is returned.</p>
 *                      <p>Otherwise, when it is `null` or `undefined`, `null` is returned.</p>
 * @returns Normalized URL, including full hostname.
 */
export function normalizeUrl(href: string): string {
    // Note: This supports any URL, even on another domain.
    // Built-in Location.normalize does not.
    // TODO verify this statement

    if (href === '') {
        // Special case - browser interprets empty string as current URL, while we need
        // what it considers a base if no base href is given.
        // Add /X to the path and then remove it.
        urlParsingNode.setAttribute('href', 'X');
        return urlParsingNode.href.replace(/X$/, '');
    } else if (href) {
        // Normalize thru href property
        urlParsingNode.setAttribute('href', href);
        return urlParsingNode.href;
    }

    // Empty
    return null;
}

// TODO move to component after all, so it can be customized
/**
 * Normalizes the media type. Removes format suffix (everything after +), and prepends `application/` if there is
 * just subtype provided.
 *
 * @param mimeType Media type to match.
 * @returns Normalized media type.
 */
export function normalizeMediaType(mimeType: string): string {
    if (!mimeType) return null;

    // Get rid of + end everything after
    mimeType = mimeType.replace(/\s*[\+;].*$/, '');

    // Prepend application/ if here is only subtype
    if (mimeType.indexOf('/') < 0) {
        mimeType = 'application/' + mimeType;
    }

    return mimeType;
}
