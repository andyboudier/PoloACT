// Demo trophy photos — the same API the club apps' trophyStore exposes, but
// backed by the visitor's own browser instead of Firestore.
//
// Same reasoning as src/storage.js: this is a public demo, so every visitor
// gets their own copy and can upload, reuse and delete photos without anyone
// else seeing it. "Reset demo" clears them along with everything else.
//
// prepareTrophyImage is a straight copy of the club apps' version — it is pure
// canvas work with no backend in it, and the demo should shrink a photo exactly
// as the real thing does.

const IDX_KEY = 'poloact-demo-trophy-index';
const IMG_KEY = 'poloact-demo-trophy-';

const MAX_DATA_URL = 700000;
const MAX_EDGE = 1000;

const read = (k, fallback) => {
  try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fallback; }
  catch (e) { return fallback; }
};
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } };

export const trophyKeyFor = (name) =>
  String(name || '')
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

export async function loadTrophyIndex() { return read(IDX_KEY, {}); }

export async function loadTrophyImage(key) { return key ? read(IMG_KEY + key, null) : null; }

export async function saveTrophyImage(key, { name, dataUrl, w, h }) {
  const record = { name, dataUrl, w, h, bytes: dataUrl.length, updated: Date.now() };
  write(IMG_KEY + key, record);
  const index = read(IDX_KEY, {});
  index[key] = { name, w, h, bytes: record.bytes, updated: record.updated };
  write(IDX_KEY, index);
  return record;
}

export async function deleteTrophyImage(key) {
  try { localStorage.removeItem(IMG_KEY + key); } catch (e) { /* ignore */ }
  const index = read(IDX_KEY, {});
  delete index[key];
  write(IDX_KEY, index);
}

export function prepareTrophyImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not an image the browser can open.'));
      img.onload = () => {
        try {
          const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
          let w = Math.max(1, Math.round(img.width * scale));
          let h = Math.max(1, Math.round(img.height * scale));
          const draw = (width, height, quality) => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            return canvas.toDataURL('image/jpeg', quality);
          };
          let out = draw(w, h, 0.82);
          const steps = [0.72, 0.62, 0.52, 0.42];
          for (let i = 0; i < steps.length && out.length > MAX_DATA_URL; i++) {
            out = draw(w, h, steps[i]);
          }
          while (out.length > MAX_DATA_URL && w > 300) {
            w = Math.round(w * 0.8);
            h = Math.round(h * 0.8);
            out = draw(w, h, 0.7);
          }
          if (out.length > MAX_DATA_URL) {
            reject(new Error('That image is too large to store, even shrunk. Try a smaller photo.'));
            return;
          }
          resolve({ dataUrl: out, w, h });
        } catch (e) {
          reject(new Error('Could not process that image.'));
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
