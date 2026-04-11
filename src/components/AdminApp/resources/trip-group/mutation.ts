import type { TripGroupCreateArgs, TripGroupUpdateArgs } from "@zenstack/input";

import { defineApiTransform } from "@/utils/ra/api";
import { diffById } from "@/utils/ra/relationships";

export const { meta, transform } = defineApiTransform("TripGroup", {
  args: {
    include: {
      tripGroupUsers: true,
    },
  },
  transform: (data, options) => {
    console.log({ data });
    const userRelationArgs = diffById(
      "userId",
      options?.previousData?.tripGroupUsers,
      data.tripGroupUsers,
      (a, b) => a.role === b.role,
    );

    return {
      name: data.name,
      tripId: data.tripId,

      tripGroupUsers: {
        deleteMany: userRelationArgs.removedIds && { userId: { in: userRelationArgs.removedIds } },
        createMany: userRelationArgs.addedItems && {
          data: userRelationArgs.addedItems.map((tu) => ({
            userId: tu.userId,
            role: tu.role,
          })),
        },
        updateMany: userRelationArgs.updatedItems?.map((tu) => ({
          where: { userId: tu.userId },
          data: { role: tu.role },
        })),
      },
    } satisfies TripGroupUpdateArgs["data"] & TripGroupCreateArgs["data"];
  },
});
