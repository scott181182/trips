"use client";

import { Alert, CircularProgress } from "@mui/material";
import type { Trip } from "@zenstack/models";
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";
import type { DataProvider } from "react-admin";

import type { createTripStore, TripStore } from "./store";

export type TripStoreApi = ReturnType<typeof createTripStore>;

export const TripStoreContext = createContext<TripStore | null>(null);

export interface TripStoreProviderProps extends PropsWithChildren {
  tripId: string;
  dataProvider: DataProvider;
}
export function TripStoreProvider({ dataProvider, tripId, children }: Readonly<TripStoreProviderProps>) {
  const [data, setData] = useState<Trip | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dataProvider
      .getOne("trip", {
        id: tripId,
      })
      .then((res) => {
        setData(res.data as Trip);
      })
      .catch((err) => {
        console.error(err);
        if (err instanceof Error) {
          setError(err);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dataProvider.getOne, tripId]);

  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    console.error(error);
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <TripStoreContext value={{ tripId, trip: data as Trip }}>{children}</TripStoreContext>;
}

export function useTripStore() {
  const ctx = useContext(TripStoreContext);

  if (!ctx) {
    throw new Error("useTripStore must be used within TripStoreProvider");
  }

  return ctx;
}
