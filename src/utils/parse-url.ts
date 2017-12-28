const URL_PATTERN = /^(\w+:)?\/\/([^/]+(?::\d+)?)?(\/.*)?$/;

export interface LocationInfo {
  readonly protocol?: string;
  readonly host?: string;
  readonly pathname?: string;
}

export interface UrlInfo extends LocationInfo {
  readonly pathrelative?: string;
}

/**
 * Rough URL parser.
 *
 * @param {string} url URL to be parsed. Must be well-formed.
 * @returns {LocationInfo | null} Parsed object or null for relative
 */
export function parseUrl(url: string): UrlInfo {
  const match = url.match(URL_PATTERN);

  if (match) {
    // URL parsed
    const info: {
      protocol?: string;
      host?: string;
      pathname?: string;
    } = {};

    if (match[1] !== undefined) {
      info.protocol = match[1];
    }
    if (match[2] !== undefined) {
      info.host = match[2];
    }
    if (match[3] !== undefined) {
      info.pathname = match[3];
    }

    return info;
  } else if (url [0] === '/') {
    // Absolute url
    return {
      pathname: url
    };
  } else {
    // Relative
    return {
      pathrelative: url
    };
  }
}
