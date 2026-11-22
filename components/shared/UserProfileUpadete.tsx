"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User,
  Phone,
  MapPin,
  FileText,
  Upload,
  Lock,
  Loader2,
  Save,
} from "lucide-react";
import { Users } from "@/app/types";
import { updateUserProfile } from "@/lib/api/users";
import { uploadImageToImgBB } from "@/lib/imgbb";
import Image from "next/image";

interface UserProfileUpadeteProps {
  user?: Users | null;
}

const UserProfileUpadete = ({ user }: UserProfileUpadeteProps) => {
  const router = useRouter();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [area, setArea] = useState(user?.area || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [image, setImage] = useState(user?.image || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] p-6 text-sm text-muted-foreground">
        User profile data is unavailable.
      </div>
    );
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);
      const displayUrl = await uploadImageToImgBB(file);
      setImage(displayUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("ImgBB upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image.",
      );
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const targetId = user._id || user.id;
    if (!targetId) {
      toast.error("User ID not found.");
      return;
    }

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (uploadingImage) {
      toast.info("Please wait until the image finishes uploading.");
      return;
    }

    try {
      setSaving(true);
      const result = await updateUserProfile(targetId, {
        name,
        phone,
        area,
        bio,
        image,
      });

      if (
        result?.success ||
        result?.modifiedCount > 0 ||
        result?._id
      ) {
        toast.success("Profile updated successfully!");
        router.refresh();
      } else {
        toast.error(result?.message || "Could not update profile.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Something went wrong while updating profile.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (name || user.name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] p-6 shadow-xs space-y-6"
    >
      <div className="rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/80 px-4 py-3.5">
        <h2 className="text-lg font-bold">Update User Profile</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Upload a profile photo via ImgBB and update your details. Email and
          role are locked.
        </p>
      </div>

      {/* Avatar Preview & ImgBB Upload */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 p-4">
        {image ? (
          <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-[#C2C0B1] bg-[#EBECE4] shrink-0">
            <Image
              src={image}
              alt={name || "Profile"}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl font-bold border border-[#C2C0B1] shrink-0">
            {initials || <User className="h-8 w-8" />}
          </div>
        )}

        <div className="space-y-2 flex-1">
          <p className="text-sm font-semibold">Profile Picture</p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, or WEBP up to 5MB. Uploaded directly to ImgBB.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <label className="inline-flex items-center gap-2 rounded-xl border border-[#C2C0B1] bg-[#EBECE4] px-3.5 py-2 text-xs font-semibold cursor-pointer hover:bg-[#E2E1D8] transition-colors">
              {uploadingImage ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Uploading to ImgBB...</span>
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" />
                  <span>Choose Photo</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage || saving}
                className="hidden"
              />
            </label>

            {image && (
              <button
                type="button"
                onClick={() => setImage("")}
                disabled={uploadingImage || saving}
                className="text-xs font-medium text-destructive hover:underline cursor-pointer"
              >
                Remove Photo
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Full Name (Editable) */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Full Name *</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
            className="w-full h-10 rounded-xl border border-[#C2C0B1] bg-[#EBECE4] px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Phone Number (Editable) */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Phone Number</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +880 17XX-XXXXXX"
            className="w-full h-10 rounded-xl border border-[#C2C0B1] bg-[#EBECE4] px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Area / Address (Editable) */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Area / Address</span>
          </label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g. Ulipur, Kurigram"
            className="w-full h-10 rounded-xl border border-[#C2C0B1] bg-[#EBECE4] px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Email (Locked) */}
        <div className="space-y-1.5">
          <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Email Address</span>
            <span className="inline-flex items-center gap-1 text-[11px]">
              <Lock className="h-3 w-3" /> Locked
            </span>
          </label>
          <input
            type="email"
            value={user.email || ""}
            disabled
            readOnly
            className="w-full h-10 rounded-xl border border-[#C2C0B1] bg-[#E2E1D8] px-3 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>

        {/* Role (Locked) */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Account Role</span>
            <span className="inline-flex items-center gap-1 text-[11px]">
              <Lock className="h-3 w-3" /> Locked
            </span>
          </label>
          <input
            type="text"
            value={user.role || ""}
            disabled
            readOnly
            className="w-full h-10 rounded-xl border border-[#C2C0B1] bg-[#E2E1D8] px-3 text-sm capitalize text-muted-foreground cursor-not-allowed"
          />
        </div>
      </div>

      {/* Bio (Editable) */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Bio</span>
        </label>
        <textarea
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write a short bio about yourself..."
          className="w-full rounded-xl border border-[#C2C0B1] bg-[#EBECE4] p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="flex justify-end pt-3 border-t border-[#C2C0B1]">
        <Button
          type="submit"
          disabled={saving || uploadingImage}
          className="rounded-xl cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default UserProfileUpadete;