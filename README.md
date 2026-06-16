# Seriály s detaily a fotkami

Statická HTML stránka — kodex motorsportu napříč sériemi (F1, MotoGP, WEC, NASCAR, IndyCar, Formule E, WRC, WorldSBK) pro sezonu **2026**.

## Deploy na Vercel

1. Nahraj tuto složku do GitHub repa.
2. Na vercelu klikni **New Project → Import** a vyber repo.
3. Žádný build step není potřeba — je to čistě statická stránka.
   - **Framework Preset:** *Other*
   - **Build Command:** *(prázdné)*
   - **Output Directory:** *(prázdné — root)*
4. Deploy.

Pro lokální test stačí libovolný statický server, např.:

```bash
npx serve .
# nebo
python3 -m http.server 8000
```

A pak otevřít `http://localhost:8000`.

## Soubory

- `index.html` — celá aplikace (Design Component).
- `support.js` — runtime pro `<x-dc>` šablonu.
- `image-slot.js` — drag-and-drop sloty pro fotky.
- `vercel.json` — konfigurace nasazení.
