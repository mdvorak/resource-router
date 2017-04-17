import { statusQualityEvaluator, simpleTypeQualityEvaluator } from './quality-evaluator';

describe(simpleTypeQualityEvaluator.name, () => {
  it('should evaluate exact type as 1', () => {
    expect(simpleTypeQualityEvaluator('foo')).toBe(1);
    expect(simpleTypeQualityEvaluator('image/png')).toBe(1);
  });

  it('should only wildcard pattern as 0', () => {
    expect(simpleTypeQualityEvaluator('*')).toBe(0);
    expect(simpleTypeQualityEvaluator('**')).toBe(0);
  });

  it('should mixed pattern as 0.5', () => {
    expect(simpleTypeQualityEvaluator('image/*')).toBe(0.5);
    expect(simpleTypeQualityEvaluator('foo*')).toBe(0.5);
    expect(simpleTypeQualityEvaluator('*bar')).toBe(0.5);
    expect(simpleTypeQualityEvaluator('foo*bar')).toBe(0.5);
    expect(simpleTypeQualityEvaluator('foo*bar*moo+json')).toBe(0.5);
  });
});

describe(statusQualityEvaluator.name, () => {
  it('should evaluate exact value as 1', () => {
    expect(statusQualityEvaluator('500')).toBe(1);
    expect(statusQualityEvaluator('0')).toBe(1);
    expect(statusQualityEvaluator('1000')).toBe(1);
    expect(statusQualityEvaluator('444')).toBe(1);
  });

  it('should evaluate wildcard by percentage of numbers', () => {
    expect(statusQualityEvaluator('?')).toBe(0);
    expect(statusQualityEvaluator('???')).toBe(0);
    expect(statusQualityEvaluator('????')).toBe(0);
    expect(statusQualityEvaluator('0?')).toBe(0.5);
    expect(statusQualityEvaluator('0??')).toEqual(1 / 3);
    expect(statusQualityEvaluator('00??')).toBe(0.5);
  });
});
