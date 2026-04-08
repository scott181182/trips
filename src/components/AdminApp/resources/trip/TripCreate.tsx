import { useCallback } from "react";
import {
  AutocompleteArrayInput,
  Create,
  ReferenceArrayInput,
  SimpleForm,
  TextInput,
  type TransformData,
} from "react-admin";

import type { TripCreateArgs } from "@/../zenstack/input";

interface FormValues {
  id: string;
  name: string;
  userIds: string[];
}

export function TripCreate() {
  const transform = useCallback<TransformData>(
    (data: FormValues) =>
      ({
        id: data.id,
        name: data.name,
        users:
          data.userIds && data.userIds.length > 0
            ? {
                createMany: {
                  data: data.userIds.map((userId) => ({
                    userId,
                    role: "CONTRIBUTOR",
                  })),
                },
              }
            : undefined,
      }) satisfies TripCreateArgs["data"],
    [],
  );

  return (
    <Create transform={transform}>
      <SimpleForm>
        <TextInput source="id" />
        <TextInput source="name" />
        <ReferenceArrayInput source="userIds" reference="user">
          <AutocompleteArrayInput label="Users" />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
}
