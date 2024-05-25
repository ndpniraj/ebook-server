import { UserDoc } from "@/models/user";
import { Request, Response } from "express";

type ErrorResponseType = {
  res: Response;
  message: string;
  status: number;
};

export const sendErrorResponse = ({
  res,
  message,
  status,
}: ErrorResponseType) => {
  res.status(status).json({ message });
};

export const formatUserProfile = (user: UserDoc): Request["user"] => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar?.url,
    signedUp: user.signedUp,
    authorId: user.authorId?.toString(),
  };
};

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export const generateS3ClientPublicUrl = (
  bucketName: string,
  uniqueKey: string
): string => {
  return `https://${bucketName}.s3.amazonaws.com/${uniqueKey}`;
};
