import { isDevMode } from '@angular/core';

/**
 * @internal
 */
export type LogFnType = (message?: any, ...optionalParams: any[]) => void;

/**
 * @internal
 */
function noOpLogFn(message: string, ...args: any[]) {
  // No operation
}

/**
 * @internal
 */
export const debugLog: {
  log: LogFnType,
  warn: LogFnType,
  error: LogFnType
} = isDevMode() && typeof console === 'object' ? console : {
  log: noOpLogFn,
  warn: noOpLogFn,
  error: noOpLogFn
};
