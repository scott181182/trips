import { Edit } from "react-admin";

import { meta, transform, tripForm } from "./mutation";

export function TripEdit() {
  return (
    <Edit queryOptions={{ meta }} transform={transform}>
      {tripForm}
    </Edit>
  );
}
