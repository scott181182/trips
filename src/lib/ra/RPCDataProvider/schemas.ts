import z from "zod";

export const responseBodySchema = z.object({
  data: z.unknown(),
  meta: z
    .object({
      serialization: z.looseObject({}).optional(),
    })
    .optional(),
});
export const countDataSchema = z.int().nonnegative();
