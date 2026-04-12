import type { TripLegCreateArgs, TripLegUpdateArgs } from "@zenstack/input";

import { defineApiTransform } from "@/utils/ra/api";
import { diffById } from "@/utils/ra/relationships";

export const { meta, transform } = defineApiTransform("TripLeg", {
  args: {
    include: {
      rsvps: true,
    },
  },
  transform: (data, options) => {
    const rsvpRelationArgs = diffById("userId", options?.previousData?.rsvps, data.rsvps);

    return {
      name: data.name,
      startTime: data.startTime,
      endTime: data.endTime,

      tripId: data.tripId,

      rsvps: {
        deleteMany: rsvpRelationArgs.removedIds && { userId: { in: rsvpRelationArgs.removedIds } },
        createMany: rsvpRelationArgs.addedItems && {
          data: rsvpRelationArgs.addedItems.map((rsvp) => ({
            userId: rsvp.userId,
            status: rsvp.status,
            notes: rsvp.notes,
          })),
        },
        updateMany: rsvpRelationArgs.updatedItems?.map((rsvp) => ({
          where: { userId: rsvp.userId },
          data: { status: rsvp.status, notes: rsvp.notes },
        })),
      },
    } satisfies TripLegUpdateArgs["data"] & TripLegCreateArgs["data"];
  },
});
