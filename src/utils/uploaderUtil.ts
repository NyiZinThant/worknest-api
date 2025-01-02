import multer from 'multer';
import ApiError from './ApiError';
import { Request } from 'express';
import path from 'path';

type FileNameCallback = (error: Error | null, filename: string) => void;
const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allowed file types
  const allowedMimeTypes = [
    'image/jpeg', // JPEG
    'image/png', // PNG
    'image/gif', // GIF
    'image/webp', // WebP
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new ApiError('Unknow file format', req.originalUrl, 400)); // Reject the file
  }
};
const imageFilename = (
  req: Request,
  file: Express.Multer.File,
  cb: FileNameCallback
) => {
  // Extract file extension
  const fileExtension = path.extname(file.originalname);
  // Generate a unique filename with the original extension
  const uniqueSuffix = `${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}${fileExtension}`;
  cb(null, uniqueSuffix);
};
const iamgeStorage = multer.diskStorage({
  filename: imageFilename,
  destination: 'uploads/images',
});
export const imageUpload = multer({
  storage: iamgeStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 500 * 1024 }, // 5 mb
});
const resumeFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allowed file types
  const allowedMimeTypes = [
    'application/pdf', // PDF
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new ApiError('Unknow file format', req.originalUrl, 400)); // Reject the file
  }
};
const resumeFilename = (
  req: Request,
  file: Express.Multer.File,
  cb: FileNameCallback
) => {
  // Extract file extension
  const fileExtension = path.extname(file.originalname);
  // Generate a unique filename with the original extension
  const uniqueSuffix = `${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}${fileExtension}`;
  cb(null, uniqueSuffix);
};
const storage = multer.diskStorage({
  filename: resumeFilename,
  destination: 'uploads/resumes',
});
export const resumeUpload = multer({
  storage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 10 * 1000 * 1024 }, // 10 mb
});
