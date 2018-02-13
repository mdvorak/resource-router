/**
 * Hyperlink according to [JSON HAL specification draft]{@link https://tools.ietf.org/html/draft-kelly-json-hal-08}.
 */
export interface Link {
  /**
   * URI according to RFC3986.
   */
  readonly href: string;
  /**
   * Its value is a string used as a hint to indicate the media type expected when dereferencing the target resource.
   */
  readonly type?: string;
  /**
   * Its presence indicates that the link is to be deprecated (i.e. removed) at a future date.
   * Its value is a URL that SHOULD provide further information about the deprecation.
   */
  readonly deprecation?: string;
  /**
   * Its value MAY be used as a secondary key for selecting Link Objects, which share the same relation type.
   */
  readonly name?: string;
  /**
   * Its value is a string and is intended for labelling the link with a human-readable identifier (as defined by RFC5988).
   */
  readonly title?: string;
  /**
   * Its value is a string and is intended for indicating the language of the target resource (as defined by RFC5988).
   */
  readonly hreflang?: string;
  /**
   * Its value is boolean and SHOULD be true when the Link Object's "href"
   * property is a URI Template.
   *
   * Its value SHOULD be considered false if it is undefined or any other
   * value than true.
   */
  readonly templated?: boolean;
  /**
   * Its value is a string which is a URI that hints about the profile of the target resource.
   */
  readonly profile?: string;
}
