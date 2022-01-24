/**
 * Type evaluator function definition.
 */
export type TypeQualityEvaluator = (type: string) => number;

/**
 * View type evaluator function, that returns:
 *
 * 0 for pure wildcard types (like '*')
 * 0.5 for types containing wildcard (like 'aaa/*')
 * 1 for types without wildcard characters.
 *
 * @param type Type to evaluate.
 * @returns Quality, in range between 0.0 and 1.0
 */
export const simpleTypeQualityEvaluator = (type: string): number => {
  // Any type is zero
  if (/^[*]+$/.test(type)) {
    return 0;
  }

  // Wildcard or specific?
  return /[*?]/.test(type) ? 0.5 : 1;
};

/**
 * Response status code pattern quality evaluator.
 *
 * 0 for pure wildcard patterns (like '*' or '???')
 * 1 for exact values (like '204')
 * otherwise its ration of wildcard to number characters. That is '2??' is 0.333, '20?' is 0.666.
 *
 * This function assumes all status strings has constant length. Otherwise values would be inconsistent.
 *
 * @param status Status to evaluate.
 * @returns Quality, in range between 0.0 and 1.0
 */
export const statusQualityEvaluator = (status: string): number => {
  const m = status.match(/\d/g);
  return m ? (m.length / status.length) : 0;
};
