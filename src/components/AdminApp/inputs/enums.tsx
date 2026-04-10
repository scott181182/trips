import type { Role, TripRole } from "@zenstack/models";
import { SelectInput, type SelectInputProps } from "react-admin";

interface SelectOption<T> {
  id: T;
  name: string;
}
function createEnumSelect<T extends string>(choices: SelectOption<T>[]) {
  return function EnumInput(props: SelectInputProps) {
    return <SelectInput {...props} choices={choices} />;
  };
}

export const RoleInput = createEnumSelect<Role>([
  { id: "GUEST", name: "Guest" },
  { id: "USER", name: "User" },
  { id: "ADMIN", name: "Admin" },
]);

export const TripRoleInput = createEnumSelect<TripRole>([
  { id: "SPECTATOR", name: "Spectator" },
  { id: "VIEWER", name: "Viewer" },
  { id: "CONTRIBUTOR", name: "Contributor" },
  { id: "OWNER", name: "Owner" },
]);
