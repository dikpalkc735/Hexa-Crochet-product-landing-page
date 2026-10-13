import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const source = join(root, "public", "images", "originals");
const target = join(root, "public", "images");
await mkdir(target, { recursive: true });

for (const name of ["product-studio", "product-lifestyle", "product-detail", "product-flatlay"]) {
  await sharp(join(source, `${name}.png`))
    .rotate()
    .resize({ width: 1120, withoutEnlargement: true })
    .webp({ quality: 88, smartSubsample: true })
    .toFile(join(target, `${name}.webp`));
}

console.log("Created four responsive-ready WebP product images; PNG originals preserved.");

