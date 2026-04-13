import type { TripLeg } from "@zenstack/models";
import { DataTable, List, ReferenceField } from "react-admin";

import { renderDateTime } from "@/utils/datetime";

const Column = DataTable.Col<TripLeg>;

export function TripLegList() {
  return (
    <List>
      <DataTable>
        <Column label="Trip">
          <ReferenceField source="tripId" reference="trip" />
        </Column>
        <Column source="name" />
        <Column label="Location">
          <ReferenceField source="locationId" reference="location" />
        </Column>
        <Column source="timeZone" />
        <Column source="startTime" render={(rec) => renderDateTime(rec.startTime, rec.timeZone)} />
        <Column source="endTime" render={(rec) => renderDateTime(rec.endTime, rec.timeZone)} />
      </DataTable>
    </List>
  );
}
