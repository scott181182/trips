import superjson, { type SuperJSONResult } from "superjson";
import type { ZodType } from "zod";

import { responseBodySchema } from "./schemas";

const QUERY_METHODS = ["GET", "DELETE"];

export async function fetchWithParams<T = unknown>(
  url: URL,
  params: Record<string, unknown>,
  init?: RequestInit & { schema?: ZodType<T> },
): Promise<T> {
  const { json, meta } = superjson.serialize(params);

  if (init?.method && !QUERY_METHODS.includes(init?.method?.toUpperCase())) {
    if (meta) {
      init.body = JSON.stringify({
        ...(json as Record<string, unknown>),
        meta: { serialization: meta },
      });
    } else {
      init.body = JSON.stringify(json);
    }
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json");
    init.headers = headers;
  } else {
    // Create copy for modification.
    url = new URL(url);

    if (Object.keys(params).length > 0) {
      url.searchParams.set("q", JSON.stringify(json));
      if (meta) {
        url.searchParams.set("meta", JSON.stringify({ serialization: meta }));
      }
    }
  }

  const response = await fetch(url, init);

  const body = await response.json();
  const bodyResult = responseBodySchema.parse(body);
  const data = superjson.deserialize({
    json: bodyResult.data as SuperJSONResult["json"],
    meta: bodyResult.meta?.serialization,
  });

  if (init?.schema) {
    return init.schema.parse(data);
  } else {
    // `T` should be `unknown` here.
    return data as T;
  }
}
