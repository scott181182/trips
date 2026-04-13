import type { TripCreateArgs, TripUpdateArgs } from "@zenstack/input";
import { omit } from "radashi";
import { ArrayInput, ReferenceInput, SimpleForm, SimpleFormIterator, TextInput } from "react-admin";

import { DefaultTimeZoneInput } from "@/components/Inputs/datetime";
import { TripRoleInput } from "@/components/Inputs/enums";
import { defineApiTransform } from "@/utils/ra/api";
import { diffById } from "@/utils/ra/relationships";

export const { meta, transform } = defineApiTransform("Trip", {
  args: {
    include: {
      users: true,
    },
  },
  transform: (data, options) => {
    const userRelationArgs = diffById("userId", options?.previousData?.users, data.users);

    return {
      id: data.id,
      name: data.name,
      locationId: data.locationId,
      defaultTimeZone: data.defaultTimeZone,

      users: {
        deleteMany: userRelationArgs.removedIds && { userId: { in: userRelationArgs.removedIds } },
        createMany: userRelationArgs.addedItems && {
          data: userRelationArgs.addedItems.map((tu) => omit(tu, ["tripId"])),
        },
        updateMany: userRelationArgs.updatedItems?.map((tu) => ({
          where: { userId: tu.userId },
          data: omit(tu, ["tripId", "userId"]),
        })),
      },
    } satisfies TripUpdateArgs["data"] | TripCreateArgs["data"];
  },
});

export const tripForm = (
  <SimpleForm>
    <TextInput source="id" isRequired />
    <TextInput source="name" isRequired />
    <ReferenceInput source="locationId" reference="location" />
    <DefaultTimeZoneInput
      source="defaultTimeZone"
      parentSource="locationId"
      parentResource="location"
      parentSourceLabel="location"
      parentTimeZoneSource="timeZone"
    />
    <ArrayInput source="users">
      <SimpleFormIterator inline>
        <ReferenceInput source="userId" reference="user" />
        <TripRoleInput source="role" />
        <ReferenceInput source="startLocationId" reference="location" />
        <ReferenceInput source="endLocationId" reference="location" />
      </SimpleFormIterator>
    </ArrayInput>
  </SimpleForm>
);
