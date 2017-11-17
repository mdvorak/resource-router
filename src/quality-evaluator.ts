/**
 * TODO
 */
export type TypeQualityEvaluator = (type: string) => number;

export function simpleTypeQualityEvaluator(type: string): number {
  // Any type is zero
  if (/^[*]+$/.test(type)) {
    return 0;
  }

  // Wildcard or specific?
  return /[*?]/.test(type) ? 0.5 : 1;
}

export function statusQualityEvaluator(status: string): number {
  const m = status.match(/\d/g);
  return m ? (m.length / status.length) : 0;
}
