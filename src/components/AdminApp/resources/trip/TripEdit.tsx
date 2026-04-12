import { ArrayInput, Edit, ReferenceInput, SimpleForm, SimpleFormIterator, TextInput } from "react-admin";

import { TripRoleInput } from "@/components/Inputs/enums";
import { meta, transform } from "./mutation";

export function TripEdit() {
  return (
    <Edit queryOptions={{ meta }} transform={transform}>
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
    </Edit>
  );
}
