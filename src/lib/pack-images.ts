import { packPhotos } from "@/content/pack-photos";

// One licensed photo per packing item, saved as src/assets/pack-<item id>.jpg (480x320).
const files = import.meta.glob<string>("../assets/pack-*.jpg", { eager: true, import: "default" });

export interface PackPhoto {
  src: string;
  alt: string;
  photographer: string;
  unsplashUrl: string;
}

export function packPhoto(id: string): PackPhoto | undefined {
  const entry = Object.entries(files).find(([path]) => path.endsWith(`/pack-${id}.jpg`));
  const meta = packPhotos[id];
  return entry && meta ? { src: entry[1], ...meta } : undefined;
}

export function packPhotoCredits() {
  return Object.entries(packPhotos)
    .filter(([id]) => packPhoto(id))
    .map(([id, m]) => ({ id, ...m }));
}
