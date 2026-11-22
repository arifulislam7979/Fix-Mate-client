import UsersClient from "@/components/shared/UsersClient";

import { getAllUsers } from "@/lib/api/users";

export default async function UsersPage() {
  const initialUsers = await getAllUsers();

  return (
    <div className="min-h-full rounded-3xl bg-[#EBECE4]/65 p-4 sm:p-6 pb-12">
      <div className="space-y-6">
        <div className="rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/85 px-5 py-4 shadow-xs">
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage platform users, update their roles, or remove unauthorized
            accounts.
          </p>
        </div>

        <UsersClient initialUsers={initialUsers} />
      </div>
    </div>
  );
}