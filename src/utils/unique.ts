export default function getUnique<T>(
  data: T[],
  checkFunc: (item: T) => any,
  filterFunc: (item: T) => boolean = () => true
) {
  const set = new Set();
  const uniques: T[] = [];
  for (const item of data) {
    if (!filterFunc(item)) {
      continue;
    }
    if (!set.has(checkFunc(item))) {
      uniques.push(item);
      set.add(checkFunc(item));
    }
  }

  return uniques;
}
