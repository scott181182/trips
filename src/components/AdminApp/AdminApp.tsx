"use client";

import { Admin, EditGuesser, ListGuesser, Resource } from "react-admin";

import { RPCDataProvider } from "@/lib/ra/RPCDataProvider";

const dataProvider = new RPCDataProvider("/api/models");

export function AdminApp() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="user" list={ListGuesser} edit={EditGuesser} recordRepresentation="name" />
    </Admin>
  );
}
