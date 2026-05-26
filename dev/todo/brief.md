# Remaining TODOs

- fix favicon to use BoHolz b
- fix RAL badge to use full height
- implement cookie consent

---

# BoHolz House Categories & Models

## House Categories

| Category | Slug | Models |
|---|---|---|
| Bestseller | `bestseller` | Virtual — no models assigned directly. Shows all models with `isFeatured = true` across all categories. |
| Bungalow | `bungalow` | 4 models |
| Doppelhaus | `doppelhaus` | 3 models |
| Einfamilienhaus | `einfamilienhaus` | 13 models |
| Generationenhaus | `generationenhaus` | 2 models |
| Kubus | `kubus` | 5 models |
| Pultdachhaus | `pultdachhaus` | 1 model |
| Stadtvilla | `stadtvilla` | 5 models |
| Zweifamilienhaus | `zweifamilienhaus` | 1 model |

**Total: 9 categories, 34 real models (+ 1 virtual Bestseller category)**

---

## Models by Category

### Bestseller (virtual — `isFeatured = true`)
- Bestseller Komfort 116 — 106.77 m², 314.395 € ⭐ (Bungalow)
- Bestseller Twin 138 — 134.76 m², 380.115 € ⭐ (Doppelhaus)
- Bestseller Family 150 — 139.52 m², 391.920 € ⭐ (Einfamilienhaus)
- Bestseller Freiraum 167 — 156.96 m², 404.855 € ⭐ (Einfamilienhaus)
- Bestseller Plus 223 — 209.9 m², 531.495 € ⭐ (Generationenhaus)
- Bestseller Weitblick 140 — 137.95 m², 390.985 € ⭐ (Stadtvilla)

### Bungalow
- Bestseller Komfort 116 — 106.77 m², 314.395 € ⭐
- Bungalow 22-117 — 111.74 m²
- Bungalow 22-134 — 134.18 m²
- Bungalow 22-149 — 134.54 m²

### Doppelhaus
- Bestseller Twin 138 — 134.76 m², 380.115 € ⭐
- Doppelhaus 28-299 — 295.17 m²
- Doppelhaus 38-238-125 — 226.87 m²

### Einfamilienhaus
- Bestseller Family 150 — 139.52 m², 391.920 € ⭐
- Bestseller Freiraum 167 — 156.96 m², 404.855 € ⭐
- Einfamilienhaus 22-141-190 — 132.49 m²
- Einfamilienhaus 22-162-190 — 152.89 m²
- Einfamilienhaus 22-173-190 — 162.45 m²
- Einfamilienhaus 25-168-190 — 161.05 m²
- Einfamilienhaus 28-182-170 — 171.06 m²
- Einfamilienhaus 28-194-170 — 177.26 m²
- Einfamilienhaus 35-146-150 — 137.47 m²
- Einfamilienhaus 35-181-150 — 171.54 m²
- Einfamilienhaus 38-115-125 — 104.94 m²
- Einfamilienhaus 38-128-125 — 116.56 m²
- Einfamilienhaus 38-138-125 — 126.73 m²
- Einfamilienhaus 45-139-75 — 126.01 m²

### Generationenhaus
- Bestseller Plus 223 — 209.9 m², 531.495 € ⭐
- Generationenhaus 28-264-160 — 244.71 m²

### Kubus
- Kubus 0-140 — 138 m²
- Kubus 0-166 — 164.54 m²
- Kubus 0-173 — 162 m²
- Kubus 0-190 — 176.30 m²
- Kubus 0-278 — 245.22 m²

### Pultdachhaus
- Pultdachhaus 21-349-225 — 280.60 m²

### Stadtvilla
- Bestseller Weitblick 140 — 137.95 m², 390.985 € ⭐
- Stadtvilla 18-140 — 136.25 m²
- Stadtvilla 22-157 — 154.96 m²
- Stadtvilla 22-166 — 164.54 m²
- Stadtvilla 22-173 — 170.85 m²

### Zweifamilienhaus
- Zweifamilienhaus 22-280 — 280 m²

---

## Notes

- **Bestseller** is a DB row but has no models directly assigned. The app filters `isFeatured = true` across all categories to populate it. 6 models are featured — one per major category.
- Only the 6 Bestseller models have prices. All other models show no price.
- Model slugs encode roof pitch, living area, and wall thickness (e.g. `einfamilienhaus-22-162-190` = 22° roof, ~162 m², 190mm wall).
- Einfamilienhaus is the largest category with 13 models. Pultdachhaus and Zweifamilienhaus have 1 model each.
