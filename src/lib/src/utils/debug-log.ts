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
const NOOP_CONSOLE = {
  log: noOpLogFn,
  warn: noOpLogFn,
  error: noOpLogFn
};

/**
 * Diagnostic logging for the router when {@link isDevMode()} is enabled.
 */
export function debugLog(): { log: LogFnType, warn: LogFnType, error: LogFnType } {
  return isDevMode() ? console : NOOP_CONSOLE;
}
