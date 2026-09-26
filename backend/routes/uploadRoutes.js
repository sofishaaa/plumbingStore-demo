import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import express from 'express';
import multer from 'multer';
import { protect, admin } from '../middleware/authMiddleware.js';
import { UPLOADS_DIR } from '../config/paths.js';

const router = express.Router();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 МБ

const EXTENSION_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename(req, file, cb) {
    // Випадкове ім'я: не залежить від імені файлу користувача
    cb(null, `${crypto.randomUUID()}${EXTENSION_BY_MIME[file.mimetype]}`);
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /^\.(jpe?g|png|webp)$/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = Object.hasOwn(EXTENSION_BY_MIME, file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Дозволені тільки зображення (jpg, png, webp)!'), false);
  }
}

// Перевірка сигнатури файлу: MIME-тип від клієнта можна підробити
const hasImageSignature = (filePath) => {
  const buffer = Buffer.alloc(12);
  const fd = fs.openSync(filePath, 'r');
  try {
    fs.readSync(fd, buffer, 0, 12, 0);
  } finally {
    fs.closeSync(fd);
  }
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng = buffer.subarray(0, 8).equals(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  );
  const isWebp =
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  return isJpeg || isPng || isWebp;
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
});
const uploadSingleImage = upload.single('image');

router.post('/', protect, admin, (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'Файл завеликий (максимум 5 МБ)'
          : err.message;
      return res.status(400).send({ message });
    }
    if (!req.file) {
      return res.status(400).send({ message: 'Файл не вибрано' });
    }
    if (!hasImageSignature(req.file.path)) {
      fs.unlink(req.file.path, () => {});
      return res
        .status(400)
        .send({ message: 'Файл не є коректним зображенням' });
    }
    res.status(200).send({
      message: 'Зображення завантажено',
      image: `/uploads/${req.file.filename}`,
    });
  });
});

export default router;
