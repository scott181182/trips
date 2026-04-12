import type { TripLeg } from "@zenstack/models";
import { DataTable, List, ReferenceField } from "react-admin";

const Column = DataTable.Col<TripLeg>;

export function TripLegList() {
  return (
    <List>
      <DataTable>
        <Column label="Trip">
          <ReferenceField source="tripId" reference="trip" />
        </Column>
        <Column source="name" />
        <Column source="startTime" />
        <Column source="endTime" />
      </DataTable>
    </List>
  );
}
