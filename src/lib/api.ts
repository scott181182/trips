import type { SchemaType } from "@zenstack/schema";
import type { SimplifiedPlainResult, UpdateArgs, FindUniqueArgs, FindManyArgs } from "@zenstackhq/orm";
import type { GetModels } from "@zenstackhq/schema";
import { camel } from "radashi";

import { fetchWithParams } from "./ra/RPCDataProvider/utils";

export class RpcApiClient {
  private readonly apiBase: URL;

  public constructor(apiBase: string) {
    if (!apiBase.endsWith("/")) {
      // Append a forward slash so URL base resolution works as expected.
      apiBase += "/";
    }
    if (!apiBase.startsWith("http")) {
      this.apiBase = new URL(apiBase, window.location.origin);
    } else {
      this.apiBase = new URL(apiBase);
    }
  }

  private async fetchRpc<M extends GetModels<SchemaType>, Args extends Record<string, unknown>>(
    model: M,
    endpoint: string,
    args: Args,
    init?: RequestInit,
  ) {
    const resource = camel(model);
    const updateUrl = new URL(`${resource}/${endpoint}`, this.apiBase);

    return fetchWithParams(updateUrl, args, init) as Promise<SimplifiedPlainResult<SchemaType, M, Args>>;
  }

  async findMany<M extends GetModels<SchemaType>, T extends FindManyArgs<SchemaType, M>>(model: M, args: T) {
    return this.fetchRpc(model, "findMany", args) as Promise<SimplifiedPlainResult<SchemaType, M, T>[]>;
  }
  async findUnique<M extends GetModels<SchemaType>, T extends FindUniqueArgs<SchemaType, M>>(model: M, args: T) {
    return this.fetchRpc(model, "findUnique", args);
  }
  async updateOne<M extends GetModels<SchemaType>, T extends UpdateArgs<SchemaType, M>>(model: M, args: T) {
    return this.fetchRpc(model, "update", args, { method: "PUT" });
  }
}
