import { timeZonesNames } from "@vvo/tzdb";
import type { Role, RsvpStatus, TripGroupRole, TripRole } from "@zenstack/models";
import { AutocompleteInput, type AutocompleteInputProps } from "react-admin";

interface SelectOption<T> {
  id: T;
  name: string;
}
function createEnumSelect<T extends string>(choices: SelectOption<T>[]) {
  return function EnumInput(props: AutocompleteInputProps) {
    return <AutocompleteInput {...props} choices={choices} />;
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

export const TripGroupRoleInput = createEnumSelect<TripGroupRole>([
  { id: "VIEWER", name: "Viewer" },
  { id: "CONTRIBUTOR", name: "Contributor" },
  { id: "OWNER", name: "Owner" },
]);

export const RsvpInput = createEnumSelect<RsvpStatus>([
  { id: "ACCEPTED", name: "Accepted" },
  { id: "MAYBE", name: "Maybe" },
  { id: "DECLINED", name: "Declined" },
]);

export const TimeZoneInput = createEnumSelect(
  timeZonesNames.map((tz) => ({
    id: tz,
    name: tz,
  })),
);
