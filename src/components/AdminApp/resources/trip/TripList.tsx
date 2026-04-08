import { DataTable, List } from "react-admin";

export function TripList() {
  return (
    <List>
      <DataTable>
        <DataTable.Col source="id" />
        <DataTable.Col source="name" />
      </DataTable>
    </List>
  );
}
