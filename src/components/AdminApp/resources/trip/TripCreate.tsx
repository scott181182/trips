import { ArrayInput, Create, ReferenceInput, SimpleForm, SimpleFormIterator, TextInput } from "react-admin";

import { TripRoleInput } from "../../inputs/enums";
import { transform } from "./mutation";

export function TripCreate() {
  return (
    <Create transform={transform}>
      <SimpleForm>
        <TextInput source="id" />
        <TextInput source="name" />
        <ArrayInput source="users">
          <SimpleFormIterator inline>
            <ReferenceInput source="userId" reference="user" />
            <TripRoleInput source="role" />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Create>
  );
}
