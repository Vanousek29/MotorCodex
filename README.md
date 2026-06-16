# Seriály s detaily a fotkami

Statická HTML stránka — kodex motorsportu napříč sériemi (F1, MotoGP, WEC, NASCAR, IndyCar, Formule E, WRC, WorldSBK) pro sezonu **2026**.

## Co je uvnitř

- `index.html` — celá aplikace (Design Component).
- `support.js` — runtime pro `<x-dc>` šablonu.
- `image-slot.js` — drag-and-drop sloty pro fotky (upravená verze, která umí načítat fotky ze složky `images/`).
- `.image-slots.state.json` — odkazy na fotky v `images/`.
- `images/` — fotky týmů, jezdců a aut (WebP, ~1,4MB celkem).
- `extract-photos.js` — Node.js skript, který umí znovu vytáhnout fotky z čerstvého `.image-slots.state.json` (viz dole).
- `vercel.json` — konfigurace nasazení.

## Deploy na Vercel

1. Nahraj tuto složku do GitHub repa.
2. Na vercelu klikni **New Project → Import** a vyber repo.
3. Žádný build step není potřeba — je to čistě statická stránka.
   - **Framework Preset:** *Other*
   - **Build Command:** *(prázdné)*
   - **Output Directory:** *(prázdné — root)*
4. Deploy.

Pro lokální test:

```bash
npx serve .
# nebo
python3 -m http.server 8000
```

## Když chceš vyměnit fotky

Fotky se přetáhnou drag-and-dropem přímo v editoru/preview. Editor ukládá změny do souboru `.image-slots.state.json` jako base64 data URL. Pro nasazení tu velkou JSON pak rozbal na samostatné soubory:

```bash
# Nahraj nový .image-slots.state.json sem (přepiš stávající), pak:
node extract-photos.js
```

Skript vytáhne každou fotku do `images/<id>.webp` a přepíše JSON tak, aby odkazoval na ty soubory. Web pak místo jednoho 1,9MB souboru stáhne menší soubory paralelně.

## Komprese fotek

Editor už fotky komprimuje při dropu — škáluje na max šířku 1200 px a ukládá jako WebP s kvalitou 0.85. Typická fotka tak vyjde na 150–300 KB. Pro další optimalizaci na produkci můžeš použít:

```bash
# Volitelná dodatečná komprese (ztratí ~30 % velikosti, jemně horší kvalita)
brew install webp           # macOS, jinak https://developers.google.com/speed/webp/download
for f in images/*.webp; do
  cwebp -q 75 -m 6 "$f" -o "$f.tmp" && mv "$f.tmp" "$f"
done
```
