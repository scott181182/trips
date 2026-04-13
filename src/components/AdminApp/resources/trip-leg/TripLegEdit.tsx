import { Edit } from "react-admin";

import { meta, transform, tripLegForm } from "./mutation";

export function TripLegEdit() {
  return (
    <Edit queryOptions={{ meta }} transform={transform}>
      {tripLegForm}
    </Edit>
  );
}
