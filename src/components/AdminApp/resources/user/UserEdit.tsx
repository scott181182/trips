import { BooleanInput, DateInput, Edit, SimpleForm, TextInput } from "react-admin";

import { RoleInput } from "@/components/Inputs/enums";

export function UserEdit() {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="id" />
        <TextInput source="email" />
        <TextInput source="name" />
        <BooleanInput source="emailVerified" />
        <TextInput source="image" disabled />
        <DateInput source="createdAt" disabled />
        <DateInput source="updatedAt" disabled />
        <RoleInput source="role" />
      </SimpleForm>
    </Edit>
  );
}
