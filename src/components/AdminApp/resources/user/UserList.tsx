import { BooleanField, DataTable, DateField, EmailField, List } from "react-admin";

export function UserList() {
  return (
    <List>
      <DataTable>
        <DataTable.Col source="id" />
        <DataTable.Col source="email">
          <EmailField source="email" />
        </DataTable.Col>
        <DataTable.Col source="name" />
        <DataTable.Col source="role" />
        <DataTable.Col source="emailVerified">
          <BooleanField source="emailVerified" />
        </DataTable.Col>
        <DataTable.Col source="createdAt">
          <DateField source="createdAt" />
        </DataTable.Col>
        <DataTable.Col source="updatedAt">
          <DateField source="updatedAt" />
        </DataTable.Col>
      </DataTable>
    </List>
  );
}
