import type { SchemaType } from "@zenstack/schema";
import type { FindFirstArgs, SimplifiedPlainResult } from "@zenstackhq/orm";
import type { GetModels } from "@zenstackhq/schema";
import type { TransformData } from "react-admin";

export type ApiTransformInput<
  M extends GetModels<SchemaType>,
  Args extends FindFirstArgs<SchemaType, M>,
> = SimplifiedPlainResult<SchemaType, M, Args>;

export type ApiTransformData<M extends GetModels<SchemaType>, Args extends FindFirstArgs<SchemaType, M>> = (
  data: ApiTransformInput<M, Args>,
  options?: { previousData?: ApiTransformInput<M, Args> },
  // biome-ignore lint/suspicious/noExplicitAny: This matches the React Admin type.
) => any;

export interface ApiTransformResult<M extends GetModels<SchemaType>, Args extends FindFirstArgs<SchemaType, M>> {
  meta: Args;
  transform: TransformData;
}

export interface ApiTranformOptions<M extends GetModels<SchemaType>, Args extends FindFirstArgs<SchemaType, M>> {
  args: Args;
  transform: ApiTransformData<M, Args>;
}
export function defineApiTransform<M extends GetModels<SchemaType>, Args extends FindFirstArgs<SchemaType, M>>(
  _model: M,
  { args, transform }: ApiTranformOptions<M, Args>,
): ApiTransformResult<M, Args> {
  return {
    meta: args,
    transform,
  };
}
