import { DataTable, List, ReferenceField } from "react-admin";

export function TripGroupList() {
  return (
    <List>
      <DataTable>
        <DataTable.Col label="Trip">
          <ReferenceField source="tripId" reference="trip" />
        </DataTable.Col>
        <DataTable.Col source="name" />
        <DataTable.Col source="id" />
      </DataTable>
    </List>
  );
}
