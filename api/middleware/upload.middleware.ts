import multer from 'multer';

export const uploadDataset = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
  },
});
