import { Request, Response } from 'express';
import { uploadFile, uploadMultiple } from './upload.service';
import multer from 'multer';
import { logger } from '../../common/logger';

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
  async (req: Request, res: Response) => {
    try {
      if (!req.file) throw new Error('No file uploaded');
      const result = await uploadFile(req.file);
      res.json({ success: true, data: result });
    } catch (error) {
      logger.error('Single upload error', error);
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  },
];

export const multipleUpload = [
  upload.array('files', 5), // max 5 files
  async (req: Request, res: Response) => {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        throw new Error('No files uploaded');
      }
      const result = await uploadMultiple(req.files as Express.Multer.File[]);
      res.json({ success: true, data: result });
    } catch (error) {
      logger.error('Multiple upload error', error);
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  },
];

