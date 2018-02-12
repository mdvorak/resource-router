import { isDevMode } from '@angular/core';

export type LogFnType = (message?: any, ...optionalParams: any[]) => void;

function noOpLogFn(message: string, ...args: any[]) {
  // No operation
}

export const debugLog: {
  log: LogFnType,
  warn: LogFnType,
  error: LogFnType
} = isDevMode() && typeof console === 'object' ? console : {
  log: noOpLogFn,
  warn: noOpLogFn,
  error: noOpLogFn
};
