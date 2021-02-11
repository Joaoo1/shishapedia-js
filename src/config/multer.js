import multer from 'multer';
import crypto from 'crypto';
import { resolve, extname } from 'path';

const maxSize = 3 * 1024 * 1024; // 3 MB

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // Format file name before save
    filename: (req, image, callback) => {
      crypto.randomBytes(3, (err, res) => {
        if (err) return callback(err);

        return callback(null, res.toString('hex') + image.originalname);
      });
    },
  }),
  // Only accept images
  fileFilter: (req, file, callback) => {
    const ext = extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return callback(new Error('Apenas imagens são aceitas'));
    }
    return callback(null, true);
  },

  limits: { fileSize: maxSize },
};
