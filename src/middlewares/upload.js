import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Asegurarnos de que la carpeta exista, si no, crearla
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Carpeta de destino
  },
  filename: (req, file, cb) => {
    // Generar un nombre único para evitar que dos imágenes se sobreescriban
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });