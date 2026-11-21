import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Users } from "@/app/types";
import UserProfileUpadete from "@/components/shared/UserProfileUpadete";
import { getUserByEmail } from "@/lib/api/users";

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Update your profile information and photo.
        </p>
      </div>

      <UserProfileUpadete
        key={currentUser._id || currentUser.id || currentUser.email}
        user={currentUser}
      />
    </div>
  );
};

export default ProfilePage;
