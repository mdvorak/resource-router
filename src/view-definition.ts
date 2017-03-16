import { Type } from '@angular/core';


export type Data = {
  [name: string]: any
};

export type StatusType = number|string;

/**
 * Defines view for given type.
 */
export interface ViewDef {

  /**
   * Component that is viewed when this view definition is matched against response.
   * Mandatory. Don't forget to add it to modules `declarations`.
   */
  component: Type<any>;

  /**
   * HTTP response status code, which is 3-digit integer.
   * It supports wildcard characters '?' (any single character) at the end of the string - that is,
   * expression '?00' is forbidden. Character 'x' is alias for '?', for better readability.
   * Wildcard character '*' is also supported, but has different meaning than usual - expression is still
   * expanded to 3 characters. Which means, '2*' == '2??', and '*' == '???'.
   * It also supports ',' character as OR operator.
   *
   * Default is '2xx', that is >=200 and <300 codes.
   *
   * Specificity is calculated by number of wildcard positions (since there is 3 character limit):
   * * `999`
   * * `99?`
   * * `9??`
   * * `???`
   *
   * Note that both `status` and `type` must be matched. To match specific status without any type, set type to '*'.
   * To match anything, set both to '*'.
   */
  status?: StatusType|StatusType[];

  /**
   * Media type of the response.
   * It supports wildcard characters '?' (any single character), '*' (zero or more characters).
   *
   * Unless status is set, this matches only 2xx (successful) status codes (see `status` property).
   *
   * To match any type (that is, fallback view), set the type to '*'.
   */
    type: string|string[];

  /**
   * Similar to quality in `Accept` header, except it accepts any number, not just range 0..1.
   * Usually it won't have to be overridden, since typical application configuration is to have many specific types
   * and one wildcard as the fallback view.
   *
   * If undefined, it is calculated from type` by following rules:
   * * Type equal to '*' has quality of `0.0`.
   * * Type with any wildcard has quality of `0.5`
   * * Type without wildcard has quality of `1.0`.
   * * Number of wildcards is insignificant.
   *
   * Otherwise it maintains order of definition (note that you should never rely on this across modules).
   *
   * It is recommended to define views with low quality only on application module level, domain-specific modules
   * should always match domain-specific types.
   *
   * Example:
   * TODO show how same wildcards are treated and how to override quality.
   */
  quality?: number;

  /**
   * Type of the parser, which should be used to produce final body.
   * If unspecified, type is determined by response Content-Type header.
   * Possible values: json, text, arrayBuffer, blob (functions of Response instance).
   */
  body?: string;

  /**
   * Values that are passed to the view. These values are not resolved in any way - observables remains observables,
   * functions are not called.
   * To have resolved data, use `resolve` value.
   */
  data?: Data;

  /**
   * TODO
   */
  resolve?: Data;

  /**
   * Disables wildcard character parsing in type property.
   *
   * Note: Wildcards in status will still work.
   */
  noWildcards?: boolean;
}
