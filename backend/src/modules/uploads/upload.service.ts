import type { Express } from 'express';
import cloudinary from '../../config/cloudinary';
import type { UploadResult, MultiUploadResult } from './upload.types';
import { logger } from '../../common/logger';

export const uploadFile = async (file: Express.Multer.File): Promise<UploadResult> => {
  try {
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: 'finops',
          resource_type: 'auto',
          public_id: `upload_${Date.now()}_${file.originalname}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);
    });

    logger.info(`✅ Uploaded ${file.originalname} to ${result.secure_url}`);
    
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      original_filename: file.originalname,
    };
  } catch (error: unknown) {
    logger.error({ error, fileName: file.originalname }, 'Upload failed');
    throw new Error('File upload failed');
  }
};

export const uploadMultiple = async (files: Express.Multer.File[]): Promise<MultiUploadResult> => {
  const results = await Promise.all(files.map(uploadFile));
  return { files: results, count: results.length };
};

export const deleteFile = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
