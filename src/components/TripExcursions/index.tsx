import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { Excursion } from "@zenstack/models";

import { apiClient } from "@/lib/dataProvider";
import { AsyncData } from "../AsyncData";
import { ExcursionRow } from "./ExcursionRow";

export interface TripExcursionsProps {
  tripId: string;
  tripLegId?: string;
}
export function TripExcursions({ tripId, tripLegId }: Readonly<TripExcursionsProps>) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["trips", tripId, "excursions", { tripLegId }],
    queryFn: () =>
      apiClient.findMany("Excursion", {
        where: {
          tripId: { equals: tripId },
          ...(tripLegId !== undefined && { tripLegId: { equals: tripLegId } }),
        },
        include: {
          rsvps: {
            include: {
              user: true,
            },
          },
          location: true,
        },
      }),
  });

  return (
    <AsyncData data={data} loading={isLoading} error={error}>
      {(data) => (
        <Stack spacing={2} direction="column">
          {data
            .toSorted((a, b) => a.startTime.getTime() - b.startTime.getTime())
            .map((excursion: Excursion) => (
              <ExcursionRow key={excursion.id} excursion={excursion} />
            ))}
        </Stack>
      )}
    </AsyncData>
  );
}
