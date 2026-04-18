import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { Stack, Typography } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { RsvpStatus, TripLeg, TripLegRsvp, User } from "@zenstack/models";
import { useCallback } from "react";

import { DraggableAvatarGroup } from "@/components/AvatarGroup";
import { apiClient, dataProvider } from "@/lib/dataProvider";
import { useTripStore } from "@/stores/trip/provider";
import cls from "./TripLegRow.module.css";

function getUsersToRender(rsvps: TripLegRsvp[], status: RsvpStatus) {
  return (
    rsvps
      .filter((r) => r.status === status)
      // biome-ignore lint/suspicious/noExplicitAny: This is included by a meta param.
      .map((r) => (r as any).user as User)
      .map((u) => ({ id: u.id, name: u.name, image: u.image }))
  );
}

export interface TripLegRowProps {
  tripLeg: TripLeg;
}
export function TripLegRow({ tripLeg }: Readonly<TripLegRowProps>) {
  const { tripId, users: tripUsers } = useTripStore();

  const { data: rsvpData } = useQuery({
    queryKey: ["trips", tripId, "legs", tripLeg.id, "rsvps"],
    queryFn: () =>
      dataProvider.getList("tripLegRsvp", { filter: { tripLegId: tripLeg.id }, meta: { include: { user: true } } }),
  });

  const createRsvp = useMutation({
    mutationFn: (vars: { userId: string; status: RsvpStatus }) =>
      dataProvider.create("tripLegRsvp", { data: { tripLegId: tripLeg.id, userId: vars.userId, status: vars.status } }),
    onSuccess: (_data, _vars, _res, ctx) => {
      ctx.client.invalidateQueries({ queryKey: ["trips", tripId, "legs", tripLeg.id, "rsvps"] });
    },
  });
  const updateRsvp = useMutation({
    mutationFn: (vars: { userId: string; status: RsvpStatus }) =>
      apiClient.updateOne("TripLegRsvp", {
        where: { tripLegId_userId: { tripLegId: tripLeg.id, userId: vars.userId } },
        data: { status: vars.status },
      }),
    onSuccess: (_data, _vars, _res, ctx) => {
      ctx.client.invalidateQueries({ queryKey: ["trips", tripId, "legs", tripLeg.id, "rsvps"] });
    },
  });

  const rsvps: TripLegRsvp[] = rsvpData?.data || [];

  const unknown = tripUsers
    .filter((tu) => !rsvps.some((rsvp) => rsvp.userId === tu.userId))
    .map((tu) => ({
      id: tu.user.id,
      name: tu.user.name,
      image: tu.user.image,
    }));
  const going = getUsersToRender(rsvps, "ACCEPTED");
  const maybe = getUsersToRender(rsvps, "MAYBE");
  const notGoing = getUsersToRender(rsvps, "DECLINED");

  const onDragEnd = useCallback(
    (ev: DragEndEvent) => {
      ev.nativeEvent?.preventDefault();
      const { source, target } = ev.operation;
      console.log({
        source: { id: source?.id, type: source?.type },
        target: { id: target?.id, type: target?.type },
      });
      if (source?.type !== "user" || target?.type !== "group") {
        return;
      }

      const sourceUser = tripUsers.find((tu) => tu.userId === source.id);
      const sourceRsvp = rsvps.find((r) => r.userId === source.id);
      if (!sourceUser) {
        return;
      }

      const targetStatus = (target.id as string).split("-", 1)[0] as RsvpStatus | "UNKNOWN";
      console.log({ sourceUser, sourceRsvp, targetStatus });
      if (targetStatus === "UNKNOWN") {
        // Check if there is an RSVP to delete.
        if (!sourceRsvp) {
          return;
        }

        console.log("TODO: delete RSVP");
      } else {
        if (!sourceRsvp) {
          // No existing RSVP, create a new one.
          createRsvp.mutate({ userId: sourceUser.userId, status: targetStatus });
        } else {
          // Check for change in status.
          if (targetStatus === sourceRsvp.status) {
            return;
          }

          // Existing RSVP, update it.
          updateRsvp.mutate({ userId: sourceUser.userId, status: targetStatus });
        }
      }
    },
    [createRsvp.mutate, updateRsvp.mutate, tripUsers, rsvps],
  );

  return (
    <DragDropProvider onDragEnd={onDragEnd}>
      <div className={`grid grid-cols-5 gap-4 border-black border rounded-lg p-4 ${cls.tripLegRow}`}>
        <div>
          <Typography variant="caption">Unknown</Typography>
          <DraggableAvatarGroup users={unknown} droppableId={`UNKNOWN-${tripLeg.id}`} />
        </div>
        <div>
          <Stack spacing={0.5}>
            <Typography variant="h3">{tripLeg.name}</Typography>
            <Typography variant="caption" color="textSecondary">
              {tripLeg.startTime.toLocaleDateString()} - {tripLeg.endTime.toLocaleDateString()}
            </Typography>
          </Stack>
        </div>
        <div>
          <Typography variant="caption">Going</Typography>
          <DraggableAvatarGroup users={going} droppableId={`ACCEPTED-${tripLeg.id}`} />
        </div>
        <div>
          <Typography variant="caption">Maybe</Typography>
          <DraggableAvatarGroup users={maybe} droppableId={`MAYBE-${tripLeg.id}`} />
        </div>
        <div>
          <Typography variant="caption">Not Going</Typography>
          <DraggableAvatarGroup users={notGoing} droppableId={`DECLINED-${tripLeg.id}`} />
        </div>
      </div>
    </DragDropProvider>
  );
}
