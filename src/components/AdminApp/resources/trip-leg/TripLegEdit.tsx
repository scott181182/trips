import {
  ArrayInput,
  DateTimeInput,
  Edit,
  ReferenceInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
} from "react-admin";

import { RsvpInput } from "@/components/Inputs/enums";
import { meta, transform } from "./mutation";

export function TripLegEdit() {
  return (
    <Edit queryOptions={{ meta }} transform={transform}>
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
    </Edit>
  );
}
