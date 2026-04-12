import { Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { TripLeg } from "@zenstack/models";

import { dataProvider } from "@/lib/dataProvider";
import { AsyncData } from "../AsyncData";

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
        <Stack>
          {data.data.map((leg: TripLeg) => (
            <div key={leg.id}>
              <Typography variant="h3">{leg.name}</Typography>
            </div>
          ))}
        </Stack>
      )}
    </AsyncData>
  );
}
