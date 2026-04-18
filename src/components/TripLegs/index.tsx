import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { TripLeg } from "@zenstack/models";

import { dataProvider } from "@/lib/dataProvider";
import { AsyncData } from "../AsyncData";
import { TripLegRow } from "./TripLegRow";

export interface TripLegsProps {
  tripId: string;
}
export function TripLegs({ tripId }: Readonly<TripLegsProps>) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["trips", tripId, "legs"],
    queryFn: () => dataProvider.getList("tripLeg", { filter: { tripId: { equals: tripId } } }),
  });

  return (
    <AsyncData data={data} loading={isLoading} error={error}>
      {(data) => (
        <Stack spacing={2} direction="column">
          {data.data
            .toSorted((a, b) => a.startTime.getTime() - b.startTime.getTime())
            .map((leg: TripLeg) => (
              <TripLegRow key={leg.id} tripLeg={leg} />
            ))}
        </Stack>
      )}
    </AsyncData>
  );
}
