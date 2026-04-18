"use client";

import { Container, Stack, Typography } from "@mui/material";

import { TripLegs } from "@/components/TripLegs";
import { useTripStore } from "@/stores/trip/provider";

export default function TripPage() {
  const { trip } = useTripStore();

  return (
    <Container sx={{ pt: 2, pb: 4 }}>
      <Typography variant="h1">{trip.name}</Typography>
      <Stack direction="column" spacing={2}>
        <Typography variant="h2">Legs</Typography>
        <TripLegs tripId={trip.id} />
      </Stack>
    </Container>
  );
}
