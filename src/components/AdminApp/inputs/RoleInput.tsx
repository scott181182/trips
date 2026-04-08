import { SelectInput, type SelectInputProps } from "react-admin";

import type { Role } from "@/../zenstack/models";

const ROLE_CHOICES = [
  { id: "GUEST", name: "Guest" },
  { id: "USER", name: "User" },
  { id: "ADMIN", name: "Admin" },
] satisfies { id: Role; name: string }[];

export function RoleInput(props: SelectInputProps) {
  return <SelectInput {...props} choices={ROLE_CHOICES} />;
}
