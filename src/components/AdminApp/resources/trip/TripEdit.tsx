import { useCallback } from "react";
import {
  ArrayInput,
  Edit,
  ReferenceInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  type TransformData,
} from "react-admin";

import type { TripUpdateArgs } from "../../../../../zenstack/input";
import type { TripUser } from "../../../../../zenstack/models";
import { TripRoleInput } from "../../inputs/enums";

interface FormValues {
  id: string;
  name: string;
  users: TripUser[];
}

export function TripEdit() {
  const transform = useCallback<TransformData>((data: FormValues, options) => {
    if (!options?.previousData) {
      return {
        id: data.id,
        name: data.name,

        users: {
          createMany: {
            data: data.users.map((tu) => ({
              role: tu.role,
              userId: tu.userId,
            })),
          },
        },
      } satisfies TripUpdateArgs["data"];
    }

    const prev = options.previousData as FormValues;
    console.log({ data, prev });
    const prevUserIds = new Set(prev.users.map((tu) => tu.userId));
    const nextUserIds = new Set(data.users.map((tu) => tu.userId));
    console.log({ prevUserIds, nextUserIds });

    const removedUserIds = prevUserIds.difference(nextUserIds);
    const newUserIds = nextUserIds.difference(prevUserIds);
    const sameUserIds = prevUserIds.intersection(nextUserIds);
    console.log({ removedUserIds, newUserIds, sameUserIds });
    const updatedUsers = data.users
      .filter((tu) => sameUserIds.has(tu.userId))
      .filter((ntu) => {
        // biome-ignore lint/style/noNonNullAssertion: existance has been more efficiently checked in the previous `filter` call.
        const ptu = prev.users.find((tu) => tu.userId === ntu.userId)!;
        // Check for updated field(s).
        return ntu.role !== ptu?.role;
      });

    return {
      id: data.id,
      name: data.name,

      users: {
        deleteMany: removedUserIds.size > 0 ? { userId: { in: [...removedUserIds] } } : undefined,
        createMany:
          newUserIds.size > 0
            ? {
                data: data.users
                  .filter((tu) => newUserIds.has(tu.userId))
                  .map((tu) => ({
                    userId: tu.userId,
                    role: tu.role,
                  })),
              }
            : undefined,
        updateMany:
          updatedUsers.length > 0
            ? updatedUsers.map((tu) => ({
                where: { userId: { equals: tu.userId } },
                data: { role: tu.role },
              }))
            : undefined,
      },
    } satisfies TripUpdateArgs["data"];
  }, []);

  return (
    <Edit queryOptions={{ meta: { include: { users: true } } }} transform={transform}>
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
