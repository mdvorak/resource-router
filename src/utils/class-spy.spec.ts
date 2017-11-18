import { Type } from '@angular/core';
import Spy = jasmine.Spy;

export function createClassSpyObj<T>(type: Type<T>): T {
  // Get all declared functions
  const methods = Object.keys(type.prototype).filter(k => typeof type.prototype[k] === 'function');
  // Create mock object from it
  return jasmine.createSpyObj(type.name, methods);
}

export function asSpy(method: Function): Spy {
  // Cast
  const spy = method as Spy;
  // Validate
  expect(spy.and).toBeDefined();
  // Return
  return spy;
}
