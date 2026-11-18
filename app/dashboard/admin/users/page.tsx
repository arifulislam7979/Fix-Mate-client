import UsersClient from "@/components/shared/UsersClient";

import { getAllUsers } from "@/lib/api/users";

export default async function UsersPage() {
  const initialUsers = await getAllUsers();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <p className="text-sm text-muted-foreground">
          Manage platform users, update their roles, or remove unauthorized
          accounts.
        </p>
      </div>

      <UsersClient initialUsers={initialUsers} />
    </div>
  );
}
