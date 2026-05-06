import { v2 as cloudinary } from 'cloudinary';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  const files = (await readdir(imagesDir)).filter(f => f.startsWith('act-'));

  console.log(`Subiendo ${files.length} imágenes a Cloudinary...\n`);

  for (const filename of files) {
    const filepath = path.join(imagesDir, filename);
    const rawBuffer = await readFile(filepath);
    // Resize if over 8MB to stay under Cloudinary's 10MB free plan limit
    const buffer = rawBuffer.length > 8 * 1024 * 1024
      ? await sharp(rawBuffer).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer()
      : rawBuffer;
    const publicId = filename.replace(/\.[^.]+$/, ''); // sin extensión

    await new Promise<void>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'hotel-termas', public_id: publicId, overwrite: true, resource_type: 'image' },
        (error, result) => {
          if (error || !result) {
            console.error(`✗ ${filename}:`, error?.message);
            return reject(error);
          }
          console.log(`✓ ${filename} → ${result.secure_url}`);
          resolve();
        }
      ).end(buffer);
    });
  }

  console.log('\n¡Listo! Todas las imágenes están en Cloudinary.');
}

main().catch(e => { console.error(e); process.exit(1); });
