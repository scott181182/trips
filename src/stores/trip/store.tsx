import type { Location, Trip, TripUser, User } from "@zenstack/models";
import { createStore } from "zustand/vanilla";

export interface UserOnTrip extends TripUser {
  user: User;
  startLocation: Location;
  endLocation: Location;
}

export interface TripStore {
  tripId: string;
  trip: Trip;
  users: UserOnTrip[];
}

export function createTripStore(initState: TripStore) {
  return createStore<TripStore>()((_set) => ({
    ...initState,
  }));
}
