import type { SchemaType } from "@zenstack/schema";
import type { SimplifiedPlainResult, UpdateArgs } from "@zenstackhq/orm";
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

  async updateOne<M extends GetModels<SchemaType>, T extends UpdateArgs<SchemaType, M>>(model: M, args: T) {
    const resource = camel(model);
    const updateUrl = new URL(`${resource}/update`, this.apiBase);

    const res = await fetchWithParams(updateUrl, args, { method: "PUT" });

    return res as SimplifiedPlainResult<SchemaType, M, T>;
  }
}
