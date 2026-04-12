import {
  ArrayInput,
  Create,
  DateTimeInput,
  ReferenceInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
} from "react-admin";

import { RsvpInput } from "@/components/Inputs/enums";
import { transform } from "./mutation";

export function TripLegCreate() {
  return (
    <Create transform={transform}>
      <SimpleForm>
        <TextInput source="name" />
        <ReferenceInput source="tripId" reference="trip" />

        <DateTimeInput source="startTime" />
        <DateTimeInput source="endTime" />

        <ArrayInput source="rsvps">
          <SimpleFormIterator inline>
            <ReferenceInput source="userId" reference="user" />
            <RsvpInput source="status" />
            <TextInput source="notes" />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Create>
  );
}
