import { ArrayInput, Create, ReferenceInput, SimpleForm, SimpleFormIterator, TextInput } from "react-admin";

import { TripGroupRoleInput } from "@/components/Inputs/enums";
import { transform } from "./mutation";

export function TripGroupCreate() {
  return (
    <Create transform={transform}>
      <SimpleForm>
        <TextInput source="name" />
        <ReferenceInput source="tripId" reference="trip" />
        <ArrayInput source="tripGroupUsers">
          <SimpleFormIterator inline>
            <ReferenceInput source="userId" reference="user" />
            <TripGroupRoleInput source="role" />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Create>
  );
}
