import z from "zod";

const filterSchema = z.looseObject({
  q: z.string().optional(),
});

export type QueryHandler = (q: string) => Record<string, unknown>;
export type QueryHandlers = Record<string, QueryHandler>;

export function resolveWhereInput(resource: string, filterRaw: unknown, handlers?: QueryHandlers) {
  if (!filterRaw) {
    return;
  }

  const filterRes = filterSchema.safeParse(filterRaw);
  if (!filterRes.success) {
    console.warn("Unsupported query object:", filterRaw);
    return undefined;
  }

  const { q, ...where } = filterRes.data;

  if (q) {
    // Handle custom queries passed by React Admin.
    if (!handlers) {
      console.warn(`Received query string for model "${resource}", but no handler provided (received "${q}")`);
    } else if (resource in handlers) {
      Object.assign(where, handlers[resource](q));
    } else {
      console.warn(`No handler for queries strings on resource "${resource}" (received "${q}")`);
    }
  }

  return where;
}
