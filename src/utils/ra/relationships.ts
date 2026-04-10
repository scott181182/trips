import { isEqual } from "radashi";

export interface DiffByIdResult<T, K extends keyof T> {
  removedIds?: T[K][];
  updatedItems?: T[];
  addedItems?: T[];
}

export function diffById<T, K extends keyof T>(
  idField: K,
  oldItems: T[] | undefined,
  newItems: T[],
  equalityFn: (a: T, b: T) => boolean = isEqual,
): DiffByIdResult<T, K> {
  if (!oldItems || oldItems.length === 0) {
    return { addedItems: newItems };
  }

  const oldIds = new Set(oldItems.map((it) => it[idField]));
  const newIds = new Set(newItems.map((it) => it[idField]));

  const removedIds = oldIds.difference(newIds);
  const addedIds = newIds.difference(oldIds);
  const matchingIds = oldIds.intersection(newIds);
  const updatedItems = newItems
    .filter((it) => matchingIds.has(it[idField]))
    .filter((newItem) => {
      // biome-ignore lint/style/noNonNullAssertion: existance has been more efficiently checked in the previous `filter` call.
      const oldItem = oldItems.find((it) => it[idField] === newItem[idField])!;
      // Check for updated field(s).
      return !equalityFn(oldItem, newItem);
    });

  return {
    removedIds: removedIds.size > 0 ? [...removedIds] : undefined,
    addedItems: addedIds.size > 0 ? newItems.filter((it) => addedIds.has(it[idField])) : undefined,
    updatedItems: updatedItems.length > 0 ? updatedItems : undefined,
  };
}
