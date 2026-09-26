import fs from 'fs';
import path from 'path';

// Каталог для зображень, завантажених через адмінку.
// frontend/public у продакшні не віддається (віддається frontend/build),
// тому файли зберігаються окремо і доступні за URL /uploads/...
// На хостингах з ефемерним диском (Render, Railway, Heroku) вкажіть
// UPLOADS_DIR на примонтований постійний диск.
const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR || 'uploads');

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

export { UPLOADS_DIR };
