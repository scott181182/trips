import type { TripCreateArgs, TripUpdateArgs } from "@zenstack/input";

import { defineApiTransform } from "@/utils/ra/api";
import { diffById } from "@/utils/ra/relationships";

export const { meta, transform } = defineApiTransform("Trip", {
  args: {
    include: {
      users: true,
    },
  },
  transform: (data, options) => {
    const userRelationArgs = diffById("userId", options?.previousData?.users, data.users, (a, b) => a.role === b.role);

    return {
      id: data.id,
      name: data.name,

      users: {
        deleteMany: userRelationArgs.removedIds && { userId: { in: userRelationArgs.removedIds } },
        createMany: userRelationArgs.addedItems && {
          data: userRelationArgs.addedItems.map((tu) => ({ userId: tu.userId, role: tu.role })),
        },
        updateMany: userRelationArgs.updatedItems?.map((tu) => ({
          where: { userId: tu.userId },
          data: { role: tu.role },
        })),
      },
    } satisfies TripUpdateArgs["data"] | TripCreateArgs["data"];
  },
});
