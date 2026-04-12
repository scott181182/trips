"use client";

import { Card, CardActions, CardContent, Container, Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { Trip } from "@zenstack/models";
import Link from "next/link";
import { Button } from "react-admin";

import { AsyncData } from "@/components/AsyncData";
import { dataProvider } from "@/lib/dataProvider";

export default function HomePage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: () => dataProvider.getList("trip", {}),
  });

  return (
    <Container sx={{ paddingTop: "1rem" }}>
      <Typography variant="h1" sx={{ mb: 2 }}>
        Trips
      </Typography>
      <AsyncData data={data} loading={isLoading} error={error}>
        {(data) => (
          <Grid container spacing={2}>
            {data.data.map((d: Trip) => (
              <Grid size={6} key={d.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h2">{d.name}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button component={Link} href={`/trips/${d.id}`} variant="contained">
                      Go
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </AsyncData>
    </Container>
  );
}
