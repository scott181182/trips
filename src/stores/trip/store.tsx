import type { Trip } from "@zenstack/models";
import { createStore } from "zustand/vanilla";

export interface TripStore {
  tripId: string;
  trip: Trip;
}

export function createTripStore(initState: TripStore) {
  return createStore<TripStore>()((_set) => ({
    ...initState,
  }));
}
