import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Users } from "@/app/types";
import UserProfileUpadete from "@/components/shared/UserProfileUpadete";
import { getUserByEmail } from "@/lib/api/users";
import { ShieldCheck, UserCog } from "lucide-react";

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/sign-in?redirectTo=/dashboard/profile");
  }

  const sessionEmail = session.user.email.trim().toLowerCase();
  const dbUser = await getUserByEmail(sessionEmail);
  const sessionUser = session.user as Partial<Users>;

  const matchedDbUser =
    dbUser?.email?.trim().toLowerCase() === sessionEmail ? dbUser : null;

  const currentUser: Users = {
    id: matchedDbUser?.id || sessionUser.id || "",
    _id: matchedDbUser?._id || "",
    name: matchedDbUser?.name || sessionUser.name || "",
    email: session.user.email,
    image: matchedDbUser?.image || sessionUser.image || "",
    role: matchedDbUser?.role || sessionUser.role || "customer",
    isVerified: Boolean(matchedDbUser?.isVerified ?? sessionUser.isVerified),
    phone: matchedDbUser?.phone || "",
    area: matchedDbUser?.area || "",
    bio: matchedDbUser?.bio || "",
  };

  return (
    <div className="min-h-full rounded-3xl bg-[#EBECE4]/65 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/70 bg-[#E2E1D8]/75 px-5 py-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <UserCog className="h-3.5 w-3.5" />
              <span>Account Settings</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              My Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Update your profile information and photo.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center rounded-full border border-border bg-[#EBECE4] px-3 py-1 text-xs font-semibold capitalize text-foreground">
              {currentUser.role}
            </span>
            {currentUser.isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-[#EBECE4]/90 p-5 sm:p-7 shadow-xs">
          <UserProfileUpadete
            key={currentUser._id || currentUser.id || currentUser.email}
            user={currentUser}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;