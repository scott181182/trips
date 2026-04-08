"use client";

import { Admin, Resource } from "react-admin";

import { RPCDataProvider } from "@/lib/ra/RPCDataProvider";
import { TripCreate } from "./resources/trip/TripCreate";
import { TripEdit } from "./resources/trip/TripEdit";
import { TripList } from "./resources/trip/TripList";
import { UserCreate } from "./resources/user/UserCreate";
import { UserEdit } from "./resources/user/UserEdit";
import { UserList } from "./resources/user/UserList";

const dataProvider = new RPCDataProvider("/api/models");

export function AdminApp() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="user" list={UserList} edit={UserEdit} create={UserCreate} recordRepresentation="name" />
      <Resource name="trip" list={TripList} edit={TripEdit} create={TripCreate} recordRepresentation="name" />
    </Admin>
  );
}
