import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { type NarrativeCharacter, NarrativeChart, type NarrativeStay } from "@/components/NarrativeChart";
import { apiClient } from "@/lib/dataProvider";
import { useTripStore } from "@/stores/trip/provider";

export function TripNarrative() {
  const { tripId } = useTripStore();

  const { data: characterData } = useQuery({
    queryKey: ["trips", tripId, "users"],
    queryFn: () =>
      apiClient.findMany("TripUser", {
        where: { tripId: { equals: tripId } },
        include: {
          startLocation: true,
          endLocation: true,
          user: {
            include: {
              legRsvps: {
                where: {
                  status: { equals: "ACCEPTED" },
                },
                include: {
                  tripLeg: {
                    select: {
                      name: true,
                      startTime: true,
                      endTime: true,
                      location: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
  });

  const characters = useMemo<NarrativeCharacter[]>(
    () =>
      characterData?.map((u) => ({
        id: u.userId,
        name: u.user.name,
        stays: u.user.legRsvps.map<NarrativeStay>((rsvp) => ({
          id: rsvp.tripLegId,
          location: rsvp.tripLeg.location?.name || rsvp.tripLeg.name,
          start: rsvp.tripLeg.startTime,
          end: rsvp.tripLeg.endTime,
        })),
      })) ?? [],
    [characterData],
  );

  console.log({ characters });

  return characterData && <NarrativeChart characters={characters} locations={[]} className="w-full h-72" />;
}
