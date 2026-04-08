import { Create, SimpleForm, TextInput } from "react-admin";

import { RoleInput } from "../../inputs/RoleInput";

export function UserCreate() {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="email" />
        <TextInput source="name" />
        <RoleInput source="role" />
      </SimpleForm>
    </Create>
  );
}
