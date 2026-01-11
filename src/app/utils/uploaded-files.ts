import fs from "fs";
import { Request } from "express";

export const getMulterUploadedFile = (req: Request) => {
  // get the multer uploaded file by accessing req.files
  let file: Express.Multer.File | undefined = undefined;

  if (req.files && Object.keys(req.files).includes("image")) {
    file = (req.files as Record<string, Express.Multer.File[]>).image[0];
  }

  return file;
};

export const getMulterUploadedFiles = (req: Request) => {
  // get the multer uploaded files by accessing req.files
  let files: Express.Multer.File[] | undefined = undefined;

  if (req.files && Object.keys(req.files).includes("images")) {
    files = (req.files as Record<string, Express.Multer.File[]>).images;
  }

  return files;
};

/**
 * Deletes files uploaded via Multer from the local disk.
 * Handles both the single 'image' field and multiple 'images' field.
 */
export const deleteMulterUploadedFiles = (req: Request) => {
  const filesToDelete: string[] = [];

  // 1. Collect path from 'image' field
  if (req.files && !Array.isArray(req.files)) {
    const filesRecord = req.files as Record<string, Express.Multer.File[]>;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (filesRecord.image && filesRecord.image.length > 0) {
      filesToDelete.push(filesRecord.image[0].path);
    }

    // 2. Collect paths from 'images' field
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (filesRecord.images && filesRecord.images.length > 0) {
      filesRecord.images.forEach((file) => {
        filesToDelete.push(file.path);
      });
    }
  }

  // 3. Execute deletion
  filesToDelete.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          // We use a console error here because failing to delete a temp file
          // shouldn't necessarily crash the whole app, but needs logging.
          console.error(`Failed to delete temp file at ${filePath}:`, err);
        }
      });
    }
  });
};
