"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Users } from "@/app/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteUser, updateUserRole } from "@/lib/api/users";

interface UsersClientProps {
  initialUsers: Users[];
}

export default function UsersClient({ initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState<Users[]>(initialUsers);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const router = useRouter();

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setActionLoading(userId);
      const result = await updateUserRole(userId, newRole);

      if (result.modifiedCount > 0) {
        toast.success(`User role updated to ${newRole}`);
      }
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId || user.id === userId
            ? { ...user, role: newRole as "customer" | "technician" | "admin" }
            : user,
        ),
      );
      router.refresh();
    } catch {
      toast.error("Failed to update role");
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDeleteUser = async () => {
    if (!selectedUserId) return;

    try {
      setActionLoading(selectedUserId);
      const result = await deleteUser(selectedUserId);
      if (result.deleteCount > 0) {
        toast.success("User deleted successfully");
      }

      setUsers((prev) =>
        prev.filter(
          (user) => user._id !== selectedUserId && user.id !== selectedUserId,
        ),
      );
      router.refresh();
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(null);
      setDeleteModalOpen(false);
      setSelectedUserId(null);
    }
  };

  return (
    <>
      <Card className="rounded-2xl border-border/70 shadow-xs bg-card">
        <CardHeader>
          <CardTitle className="text-lg">All Registered Users</CardTitle>
          <CardDescription>
            Control user permissions and account statuses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm">
                  {users.map((user) => {
                    const userId = user._id || user.id!;
                    const role = user.role || "customer";
                    const isVerified = user.isVerified || true;
                    const isProcessing = actionLoading === userId;
                    const isMainAdmin = user.email === "admin@gmail.com";

                    return (
                      <tr
                        key={userId}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {user.name
                              ? user.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          {user.name || "N/A"}{" "}
                          {isMainAdmin && (
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-1">
                              You
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">
                          {user.email}
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={role}
                            disabled={isProcessing || isMainAdmin}
                            onChange={(e) =>
                              handleRoleChange(userId, e.target.value)
                            }
                            className={`text-xs font-semibold rounded-lg border px-3 py-1.5 focus:outline-none focus:ring-2 transition-colors ${
                              isMainAdmin
                                ? "opacity-60 cursor-not-allowed bg-muted"
                                : "cursor-pointer"
                            } ${
                              role === "admin"
                                ? "bg-purple-500/10 border-purple-500/30 text-purple-600 focus:ring-purple-500"
                                : role === "technician"
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-600 focus:ring-amber-500"
                                  : "bg-blue-500/10 border-blue-500/30 text-blue-600 focus:ring-blue-500"
                            }`}
                          >
                            <option
                              value="customer"
                              className="bg-background text-foreground"
                            >
                              Customer
                            </option>
                            <option
                              value="technician"
                              className="bg-background text-foreground"
                            >
                              Technician
                            </option>
                            <option
                              value="admin"
                              className="bg-background text-foreground"
                            >
                              Admin
                            </option>
                          </select>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium ${isVerified ? "text-emerald-600" : "text-amber-600"}`}
                          >
                            {isVerified ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <Clock className="h-3.5 w-3.5" />
                            )}
                            {isVerified ? "Active" : "Pending"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {!isMainAdmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isProcessing}
                              onClick={() => {
                                setSelectedUserId(userId);
                                setDeleteModalOpen(true);
                              }}
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                              title="Delete / Suspend User"
                            >
                              {isProcessing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-lg space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-destructive">
              <div className="p-3 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Are you absolutely sure?</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. This will permanently delete the
              user account and remove their data from the server.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedUserId(null);
                }}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteUser}
                className="rounded-xl"
              >
                Yes, Delete User
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
