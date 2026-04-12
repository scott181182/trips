"use client";

import { Admin, Resource } from "react-admin";

import { dataProvider } from "@/lib/dataProvider";
import { TripCreate } from "./resources/trip/TripCreate";
import { TripEdit } from "./resources/trip/TripEdit";
import { TripList } from "./resources/trip/TripList";
import { TripGroupCreate } from "./resources/trip-group/TripGroupCreate";
import { TripGroupEdit } from "./resources/trip-group/TripGroupEdit";
import { TripGroupList } from "./resources/trip-group/TripGroupList";
import { TripLegCreate } from "./resources/trip-leg/TripLegCreate";
import { TripLegEdit } from "./resources/trip-leg/TripLegEdit";
import { TripLegList } from "./resources/trip-leg/TripLegList";
import { UserCreate } from "./resources/user/UserCreate";
import { UserEdit } from "./resources/user/UserEdit";
import { UserList } from "./resources/user/UserList";

export function AdminApp() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="user" list={UserList} edit={UserEdit} create={UserCreate} recordRepresentation="name" />
      <Resource name="trip" list={TripList} edit={TripEdit} create={TripCreate} recordRepresentation="name" />
      <Resource
        name="tripGroup"
        options={{ label: "Trip Groups" }}
        list={TripGroupList}
        edit={TripGroupEdit}
        create={TripGroupCreate}
        recordRepresentation="name"
      />
      <Resource
        name="tripLeg"
        options={{ label: "Trip Leg" }}
        list={TripLegList}
        edit={TripLegEdit}
        create={TripLegCreate}
        recordRepresentation="name"
      />
    </Admin>
  );
}
