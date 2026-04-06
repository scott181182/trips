import type { SchemaDef } from "@zenstackhq/orm/schema";

import type { ApiHandler, LogConfig, RequestContext } from "./types";

export class GraphqlApiHandler<Schema extends SchemaDef = SchemaDef> implements ApiHandler<Schema> {
  public constructor(
    public readonly schema: Schema,
    public readonly log: LogConfig | undefined = ["info"],
  ) {}

  public async handleRequest(context: RequestContext<Schema>): Promise<Response> {
    throw new Error("Method not implemented.");
  }
}
