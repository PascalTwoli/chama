// This declaration must be in a location TypeScript will find globally.
// Move this file to /Users/theboys/dev/chama/chama-frontend/src/types/lodash.isequal.d.ts
// or ensure your tsconfig.json includes it (see below).

declare module 'lodash.isequal' {
  function isEqual(value: any, other: any): boolean;
  export default isEqual;
}
