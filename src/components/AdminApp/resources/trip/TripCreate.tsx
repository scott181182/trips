import { Create } from "react-admin";

import { transform, tripForm } from "./mutation";

export function TripCreate() {
  return <Create transform={transform}>{tripForm}</Create>;
}
