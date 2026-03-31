import { Request, Response, NextFunction } from 'express';
import { uploadFile, uploadMultiple } from './upload.service';
import multer from 'multer';
import { logger } from '../../config/logger';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { ApiResponse } from '../../common/utils/apiResponse';
import type { Express } from 'express';

// Multer memory storage (no disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export const singleUpload = [
  upload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new Error('No file uploaded');
    const result = await uploadFile(req.file);
    ApiResponse.success(result, res);
  }),
];

export const multipleUpload = [
  upload.array('files', 5), // max 5 files
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      throw new Error('No files uploaded');
    }
    const result = await uploadMultiple(req.files as Express.Multer.File[]);
    ApiResponse.success(result, res);
  }),
];
