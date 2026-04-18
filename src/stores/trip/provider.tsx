"use client";

import { useQuery } from "@tanstack/react-query";
import type { Trip } from "@zenstack/models";
import { createContext, type PropsWithChildren, useContext, useMemo } from "react";
import type { DataProvider } from "react-admin";

import { AsyncData } from "@/components/AsyncData";
import type { createTripStore, TripStore, UserOnTrip } from "./store";

export type TripStoreApi = ReturnType<typeof createTripStore>;

export const TripStoreContext = createContext<TripStore | null>(null);

export interface TripStoreProviderProps extends PropsWithChildren {
  tripId: string;
  dataProvider: DataProvider;
}
export function TripStoreProvider({ dataProvider, tripId, children }: Readonly<TripStoreProviderProps>) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["trips", tripId],
    queryFn: () =>
      dataProvider.getOne("trip", {
        id: tripId,
        meta: { include: { users: { include: { user: true, startLocation: true, endLocation: true } } } },
      }),
  });

  const contextValue = useMemo<TripStore | undefined>(
    () =>
      data
        ? {
            tripId,
            trip: data.data as Trip,
            users: data.data.users as UserOnTrip[],
          }
        : undefined,
    [data, tripId],
  );

  return (
    <AsyncData data={contextValue} loading={isLoading} error={error}>
      {(value) => <TripStoreContext.Provider value={value}>{children}</TripStoreContext.Provider>}
    </AsyncData>
  );
}

export function useTripStore() {
  const ctx = useContext(TripStoreContext);

  if (!ctx) {
    throw new Error("useTripStore must be used within TripStoreProvider");
  }

  return ctx;
}
