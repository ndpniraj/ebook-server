import cloudinary from "@/cloud/cludinary";
import { Request } from "express";
import { File } from "formidable";

export const uploadAvatarToCloudinary = async (
  file: File,
  avatarId?: string
) => {
  if (avatarId) {
    // if user already has a profile image remove the old first
    await cloudinary.uploader.destroy(avatarId);
  }

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    file.filepath,
    {
      width: 300,
      height: 300,
      gravity: "face",
      crop: "fill",
    }
  );

  return { id: public_id, url: secure_url };
};
