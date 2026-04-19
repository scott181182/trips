import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { Card, CardContent, Typography } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Excursion, ExcursionRsvp, RsvpStatus, User } from "@zenstack/models";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";

import { DraggableAvatarGroup } from "@/components/AvatarGroup";
import { apiClient, dataProvider } from "@/lib/dataProvider";
import { useTripStore } from "@/stores/trip/provider";
import { rsvpToAvatarUser } from "@/utils/rsvp";
import type { AvatarUser } from "../ProfileIcon";
import cls from "./ExcursionRow.module.css";

interface ExcursionRsvpWithUser extends ExcursionRsvp {
  user: User;
}

function getUsersToRender(rsvps: ExcursionRsvpWithUser[], status: RsvpStatus): AvatarUser[] {
  return rsvps.filter((r) => r.status === status).map((r) => rsvpToAvatarUser(r));
}

export interface ExcursionRowProps {
  excursion: Excursion;
}
export function ExcursionRow({ excursion }: Readonly<ExcursionRowProps>) {
  const { tripId, users: tripUsers } = useTripStore();

  const [unknown, setUnknown] = useState<AvatarUser[]>(
    tripUsers.map((tu) => ({
      id: tu.user.id,
      name: tu.user.name,
      image: tu.user.image,
    })),
  );
  const [accepted, setAccepted] = useState<AvatarUser[]>([]);
  const [maybe, setMaybe] = useState<AvatarUser[]>([]);
  const [declined, setDeclined] = useState<AvatarUser[]>([]);

  const { data: rsvpData } = useQuery({
    queryKey: ["trips", tripId, "excursions", excursion.id, "rsvps"],
    queryFn: () =>
      apiClient.findMany("ExcursionRsvp", {
        where: { excursionId: excursion.id },
        include: { user: true },
      }),
  });
  const rsvps = rsvpData || [];

  useEffect(() => {
    setUnknown(
      tripUsers
        .filter((tu) => !rsvps.some((rsvp) => rsvp.userId === tu.userId))
        .map((tu) => ({
          id: tu.user.id,
          name: tu.user.name,
          image: tu.user.image,
        })),
    );
    setAccepted(getUsersToRender(rsvps, "ACCEPTED"));
    setMaybe(getUsersToRender(rsvps, "MAYBE"));
    setDeclined(getUsersToRender(rsvps, "DECLINED"));
  }, [tripUsers, rsvps]);

  const createRsvp = useMutation({
    mutationFn: (vars: { userId: string; status: RsvpStatus }) =>
      dataProvider.create("excursionRsvp", {
        data: { excursionId: excursion.id, userId: vars.userId, status: vars.status },
      }),
    onSuccess: (_data, _vars, _res, ctx) => {
      ctx.client.invalidateQueries({ queryKey: ["trips", tripId, "excursions", excursion.id, "rsvps"] });
    },
  });
  const updateRsvp = useMutation({
    mutationFn: (vars: { userId: string; status: RsvpStatus }) =>
      apiClient.updateOne("ExcursionRsvp", {
        where: { excursionId_userId: { excursionId: excursion.id, userId: vars.userId } },
        data: { status: vars.status },
      }),
    onSuccess: (_data, _vars, _res, ctx) => {
      ctx.client.invalidateQueries({ queryKey: ["trips", tripId, "excursions", excursion.id, "rsvps"] });
    },
  });

  const optimisticMove = useCallback(
    (userId: string, targetStatus: RsvpStatus | "UNKNOWN") => {
      setUnknown((prev) => prev.filter((u) => u.id !== userId));
      setAccepted((prev) => prev.filter((u) => u.id !== userId));
      setMaybe((prev) => prev.filter((u) => u.id !== userId));
      setDeclined((prev) => prev.filter((u) => u.id !== userId));

      const user = tripUsers.find((tu) => tu.userId === userId);
      if (!user) {
        return;
      }
      const avatarUser = { id: user.userId, name: user.user.name, image: user.user.image };

      switch (targetStatus) {
        case "UNKNOWN":
          setUnknown((prev) => [...prev, avatarUser]);
          break;
        case "ACCEPTED":
          setAccepted((prev) => [...prev, avatarUser]);
          break;
        case "MAYBE":
          setMaybe((prev) => [...prev, avatarUser]);
          break;
        case "DECLINED":
          setDeclined((prev) => [...prev, avatarUser]);
          break;
      }
    },
    [tripUsers],
  );

  const onDragEnd = useCallback(
    (ev: DragEndEvent) => {
      ev.nativeEvent?.preventDefault();
      const { source, target } = ev.operation;
      if (source?.type !== "user" || target?.type !== "group") {
        return;
      }

      const sourceUser = tripUsers.find((tu) => tu.userId === source.id);
      const sourceRsvp = rsvps.find((r) => r.userId === source.id);
      if (!sourceUser) {
        return;
      }

      const targetStatus = (target.id as string).split("-", 1)[0] as RsvpStatus | "UNKNOWN";
      optimisticMove(sourceUser.userId, targetStatus);
      if (targetStatus === "UNKNOWN") {
        if (!sourceRsvp) {
          return;
        }

        console.log("TODO: delete RSVP");
      } else {
        if (!sourceRsvp) {
          createRsvp.mutate({ userId: sourceUser.userId, status: targetStatus });
        } else {
          if (targetStatus === sourceRsvp.status) {
            return;
          }

          updateRsvp.mutate({ userId: sourceUser.userId, status: targetStatus });
        }
      }
    },
    [createRsvp.mutate, updateRsvp.mutate, tripUsers, rsvps.find, optimisticMove],
  );

  return (
    <DragDropProvider onDragEnd={onDragEnd}>
      <Card variant="outlined">
        <CardContent
          className={clsx(`grid gap-4`, cls.excursionRow, unknown.length > 0 ? "grid-cols-5" : "grid-cols-4")}
        >
          <div>
            <Typography variant="h4">{excursion.name}</Typography>
            <Typography variant="caption" color="textSecondary">
              {excursion.startTime.toLocaleDateString()} - {excursion.endTime.toLocaleDateString()}
            </Typography>
          </div>
          <div>
            <Typography variant="caption">Going</Typography>
            <DraggableAvatarGroup users={accepted} droppableId={`ACCEPTED-${excursion.id}`} />
          </div>
          <div>
            <Typography variant="caption">Maybe</Typography>
            <DraggableAvatarGroup users={maybe} droppableId={`MAYBE-${excursion.id}`} />
          </div>
          <div>
            <Typography variant="caption">Not Going</Typography>
            <DraggableAvatarGroup users={declined} droppableId={`DECLINED-${excursion.id}`} />
          </div>
          {unknown.length > 0 && (
            <div>
              <Typography variant="caption">Unknown</Typography>
              <DraggableAvatarGroup users={unknown} droppableId={`UNKNOWN-${excursion.id}`} />
            </div>
          )}
        </CardContent>
      </Card>
    </DragDropProvider>
  );
}
