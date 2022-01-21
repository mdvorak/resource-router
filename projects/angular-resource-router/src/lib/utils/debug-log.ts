import { isDevMode } from '@angular/core';

/**
 * @internal
 */
export type LogFnType = (message?: any, ...optionalParams: any[]) => void;

/**
 * @internal
 */
const noOpLogFn = (message: string, ...args: any[]) => {
  // No operation
};

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
export const debugLog = (): { log: LogFnType; warn: LogFnType; error: LogFnType } =>
  isDevMode() ? console : NOOP_CONSOLE;
