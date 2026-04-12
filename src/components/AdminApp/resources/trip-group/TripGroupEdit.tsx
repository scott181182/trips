import { ArrayInput, Edit, ReferenceInput, SimpleForm, SimpleFormIterator, TextInput } from "react-admin";

import { TripGroupRoleInput } from "@/components/Inputs/enums";
import { meta, transform } from "./mutation";

export function TripGroupEdit() {
  return (
    <Edit queryOptions={{ meta }} transform={transform}>
      <SimpleForm>
        <TextInput source="id" />
        <TextInput source="name" />
        <ReferenceInput source="tripId" reference="trip" />
        <ArrayInput source="tripGroupUsers">
          <SimpleFormIterator inline>
            <ReferenceInput source="userId" reference="user" />
            <TripGroupRoleInput source="role" />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );
}
