import { Create } from "react-admin";

import { transform, tripLegForm } from "./mutation";

export function TripLegCreate() {
  return <Create transform={transform}>{tripLegForm}</Create>;
}
