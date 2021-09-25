export function flatten<T>(arrays: T[][]): T[] {
  const merged: T[] = [];
  return merged.concat(...arrays);
}
