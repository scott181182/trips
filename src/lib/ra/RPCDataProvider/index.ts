/** biome-ignore-all lint/suspicious/noExplicitAny: `any` is used by the interface we're implementing. */
"use client";

import type { SchemaType } from "@zenstack/schema";
import type { CreateArgs, FindFirstArgs, FindManyArgs, UpdateArgs } from "@zenstackhq/orm";
import type { GetModels } from "@zenstackhq/schema";
import type {
  CreateParams,
  CreateResult,
  DataProvider,
  DeleteManyParams,
  DeleteManyResult,
  DeleteParams,
  DeleteResult,
  GetListParams,
  GetListResult,
  GetManyParams,
  GetManyReferenceParams,
  GetManyReferenceResult,
  GetManyResult,
  GetOneParams,
  GetOneResult,
  Identifier,
  QueryFunctionContext,
  RaRecord,
  UpdateManyParams,
  UpdateManyResult,
  UpdateParams,
  UpdateResult,
} from "react-admin";

import { type QueryHandlers, resolveWhereInput } from "./filter";
import { countDataSchema } from "./schemas";
import { fetchWithParams } from "./utils";

const KNOWN_META_KEYS = ["include", "select"];
function applyMetaParams(qInput: Record<string, unknown>, meta: any) {
  if (!meta) {
    return;
  }

  for (const knownKey of KNOWN_META_KEYS) {
    if (knownKey in meta) {
      qInput[knownKey] = meta[knownKey];
    }
  }
}

export interface RPCDataProviderOptions {
  queryHandlers?: QueryHandlers;
  idMap?: Record<string, string | ((data: any) => string)>;
}
export class RPCDataProvider implements DataProvider {
  public readonly supportAbortSignal = true;

  private readonly apiBase: URL;
  private readonly queryHandlers: QueryHandlers;
  private readonly idMap: Record<string, string | ((data: any) => string)>;

  public constructor(apiBase: string, options?: RPCDataProviderOptions) {
    if (!apiBase.endsWith("/")) {
      // Append a forward slash so URL base resolution works as expected.
      apiBase += "/";
    }
    if (!apiBase.startsWith("http")) {
      this.apiBase = new URL(apiBase, window.location.origin);
    } else {
      this.apiBase = new URL(apiBase);
    }

    this.queryHandlers = options?.queryHandlers ?? {};
    this.idMap = options?.idMap ?? {};
  }

  private applyId(resource: string, item: any) {
    if (!(resource in this.idMap)) {
      return;
    }

    if (typeof this.idMap[resource] === "string") {
      const idField = this.idMap[resource];
      item.id = item[idField];
    } else {
      // Function to generate a custom ID.
      const idFn = this.idMap[resource];
      item.id = idFn(item);
    }
  }
  private applyIds(resource: string, items: any[]) {
    if (!(resource in this.idMap)) {
      return;
    }

    items.forEach((it) => {
      this.applyId(resource, it);
    });
  }

  public async getList<RecordType extends RaRecord = any>(
    resource: string,
    params: GetListParams & QueryFunctionContext,
  ): Promise<GetListResult<RecordType>> {
    const countUrl = new URL(`${resource}/count`, this.apiBase);
    const findManyUrl = new URL(`${resource}/findMany`, this.apiBase);

    const qInput: FindManyArgs<SchemaType, GetModels<SchemaType>> = {
      where: resolveWhereInput(resource, params.filter, this.queryHandlers),
    };
    if (params.sort) {
      qInput.orderBy = {
        [params.sort.field]: params.sort.order.toLowerCase(),
      };
    }

    const countDataPromise = fetchWithParams(countUrl, qInput, { schema: countDataSchema, signal: params.signal });

    applyMetaParams(qInput, params.meta);
    if (params.pagination) {
      qInput.skip = (params.pagination.page - 1) * params.pagination.perPage;
      qInput.take = params.pagination.perPage;
    }
    const findManyDataPromise = fetchWithParams<RecordType[]>(findManyUrl, qInput, { signal: params.signal });

    const [countData, findManyData] = await Promise.all([countDataPromise, findManyDataPromise]);
    this.applyIds(resource, findManyData);

    return {
      total: countData,
      data: findManyData,
    };
  }

  public async getOne<RecordType extends RaRecord = any>(
    resource: string,
    params: GetOneParams<RecordType> & QueryFunctionContext,
  ): Promise<GetOneResult<RecordType>> {
    const findFirstUrl = new URL(`${resource}/findFirst`, this.apiBase);

    const qInput: FindFirstArgs<SchemaType, GetModels<SchemaType>> = {
      where: {
        // @ts-expect-error
        id: { equals: params.id },
      },
    };
    applyMetaParams(qInput, params.meta);

    const findFirstData = await fetchWithParams(findFirstUrl, qInput, { signal: params.signal });
    if (!findFirstData) {
      throw new Error(`Could not find '${resource}' with id '${params.id}'`);
    }
    this.applyId(resource, findFirstData);

    return {
      data: findFirstData as RecordType,
    };
  }

  public async getMany<RecordType extends RaRecord = any>(
    resource: string,
    params: GetManyParams<RecordType> & QueryFunctionContext,
  ): Promise<GetManyResult<RecordType>> {
    return this.getList(resource, params);
  }
  public async getManyReference<RecordType extends RaRecord = any>(
    resource: string,
    params: GetManyReferenceParams & QueryFunctionContext,
  ): Promise<GetManyReferenceResult<RecordType>> {
    console.warn("getManyReference not yet implement", { resource, params });
    throw new Error("Not yet implemented: getManyReference");
  }
  public async update<RecordType extends RaRecord = any>(
    resource: string,
    params: UpdateParams,
  ): Promise<UpdateResult<RecordType>> {
    const updateUrl = new URL(`${resource}/update`, this.apiBase);

    const qInput: UpdateArgs<SchemaType, GetModels<SchemaType>> = {
      where: {
        // @ts-expect-error
        id: { equals: params.id },
      },
      data: params.data,
    };
    applyMetaParams(qInput, params.meta);
    const updateData = await fetchWithParams(updateUrl, qInput, { method: "PUT" });
    this.applyId(resource, updateData);

    return {
      data: updateData as RecordType,
    };
  }
  public async updateMany<RecordType extends RaRecord = any>(
    resource: string,
    params: UpdateManyParams,
  ): Promise<UpdateManyResult<RecordType>> {
    console.warn("updateMany not yet implement", { resource, params });
    throw new Error("Not yet implemented: updateMany");
  }
  public async create<
    RecordType extends Omit<RaRecord, "id"> = any,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier },
  >(resource: string, params: CreateParams): Promise<CreateResult<ResultRecordType>> {
    const createUrl = new URL(`${resource}/create`, this.apiBase);

    const qInput: CreateArgs<SchemaType, GetModels<SchemaType>> = {
      data: params.data,
    };
    applyMetaParams(qInput, params.meta);
    const createData = await fetchWithParams(createUrl, qInput, { method: "POST" });
    this.applyId(resource, createData);

    return {
      data: createData as ResultRecordType,
    };
  }
  public async delete<RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteParams<RecordType>,
  ): Promise<DeleteResult<RecordType>> {
    console.warn("delete not yet implement", { resource, params });
    throw new Error("Not yet implemented: delete");
  }
  public async deleteMany<RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteManyParams<RecordType>,
  ): Promise<DeleteManyResult<RecordType>> {
    console.warn("deleteMany not yet implement", { resource, params });
    throw new Error("Not yet implemented: deleteMany");
  }
}
