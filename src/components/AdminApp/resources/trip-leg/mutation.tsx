import type { TripLegCreateArgs, TripLegUpdateArgs } from "@zenstack/input";
import { omit } from "radashi";
import { ArrayInput, ReferenceInput, SimpleForm, SimpleFormIterator, TextInput } from "react-admin";

import { DateTimeDateInput, DefaultTimeZoneInput } from "@/components/Inputs/datetime";
import { RsvpInput } from "@/components/Inputs/enums";
import { dateToZonedDateTime, zonedDateTimeToDate } from "@/utils/datetime";
import { defineApiTransform } from "@/utils/ra/api";
import { diffById } from "@/utils/ra/relationships";

export const { meta, transform } = defineApiTransform("TripLeg", {
  args: {
    include: {
      rsvps: true,
    },
  },
  transform: (data, options) => {
    const rsvpRelationArgs = diffById("userId", options?.previousData?.rsvps, data.rsvps);

    // This actually come in as strings from the form.
    const startTimeDate = dateToZonedDateTime(data.startTime, data.timeZone);
    const endTimeDate = dateToZonedDateTime(data.endTime, data.timeZone);

    return {
      name: data.name,
      timeZone: data.timeZone,
      startTime: zonedDateTimeToDate(startTimeDate),
      endTime: zonedDateTimeToDate(endTimeDate),

      tripId: data.tripId,
      locationId: data.locationId,

      rsvps: {
        deleteMany: rsvpRelationArgs.removedIds && { userId: { in: rsvpRelationArgs.removedIds } },
        createMany: rsvpRelationArgs.addedItems && {
          data: rsvpRelationArgs.addedItems.map((rsvp) => omit(rsvp, ["tripLegId"])),
        },
        updateMany: rsvpRelationArgs.updatedItems?.map((rsvp) => ({
          where: { userId: rsvp.userId },
          data: omit(rsvp, ["tripLegId", "userId"]),
        })),
      },
    } satisfies TripLegUpdateArgs["data"] & TripLegCreateArgs["data"];
  },
});

export const tripLegForm = (
  <SimpleForm>
    <TextInput source="name" />
    <ReferenceInput source="tripId" reference="trip" />
    <ReferenceInput source="locationId" reference="location" />
    <DefaultTimeZoneInput
      source="timeZone"
      parentSource="tripId"
      parentResource="trip"
      parentSourceLabel="trip"
      parentTimeZoneSource="defaultTimeZone"
    />

    <DateTimeDateInput source="startTime" />
    <DateTimeDateInput source="endTime" />

    <ArrayInput source="rsvps">
      <SimpleFormIterator inline>
        <ReferenceInput source="userId" reference="user" />
        <RsvpInput source="status" />
        <TextInput source="notes" />
      </SimpleFormIterator>
    </ArrayInput>
  </SimpleForm>
);
