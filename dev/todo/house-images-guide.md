# House Models Image Mapping

## Rules
- **NEVER replace a hero image.** Hero = `is_hero = true` in `model_media`. Any record with `is_hero = true` is untouchable.
- Verify every filename exists in the Cloudflare bucket before writing to the DB.

---

## Image Mapping

Format: `House Model --> image1, image2, ...`

### Bestseller

```
Bestseller Family 150  --> environmental-protection-683437.jpg, neues-bild_nachhaltigkeit.jpg, shutterstock_1107072644.jpg
Bestseller Komfort 116 --> AdobeStock_124579847.jpeg, shutterstock_485712322.jpg
Bestseller Twin 138    --> shutterstock_167874614.jpg
Bestseller Weitblick 140 --> neues-bild_nachhaltigkeit.jpg, shutterstock_1107072644.jpg
```

### Freiraum

```
Freiraum 167 --> AdobeStock_215081808.jpeg, AdobeStock_333504091_1.jpeg
```

### Plus

```
Plus 223 --> AdobeStock_124579847.jpeg, AdobeStock_303568642.jpeg
```

### Bungalow *(category images)*

```
BU 117-22-0  --> P_AdobeStock_622134419.jpg, shutterstock_485712322.jpg
BU 134-22-0  --> P_AdobeStock_622134419.jpg, shutterstock_485712322.jpg
BU 149-22-0  --> P_AdobeStock_622134419.jpg, shutterstock_485712322.jpg
```

### DoppelhÃ¤user *(category images)*

```
DH 28-299-0   --> 502125-01-XXL_02_RET- CYMK.jpg, forest-3315896_1920.jpg, shutterstock_1043328154.jpg
DH 38-238-125 --> 502125-01-XXL_02_RET- CYMK.jpg, forest-3315896_1920.jpg, shutterstock_1043328154.jpg
```

### PultdachhÃ¤user *(category images)*

```
PDH 21-349-225 --> 115957-02-XXL- CYMK.jpg, shutterstock_1858146868.jpg
```

### Stadtvillen *(category images)*

```
SV 18-140          --> AdobeStock_193248722.jpeg, environmental-protection-683437.jpg, shutterstock_1296270274.jpg
SV 18-140 Flachdach --> AdobeStock_193248722.jpeg, environmental-protection-683437.jpg, shutterstock_1296270274.jpg
SV 22-157          --> AdobeStock_193248722.jpeg, environmental-protection-683437.jpg, shutterstock_1296270274.jpg
SV 22-166          --> AdobeStock_193248722.jpeg, environmental-protection-683437.jpg, shutterstock_1296270274.jpg
SV 22-173          --> AdobeStock_193248722.jpeg, environmental-protection-683437.jpg, shutterstock_1296270274.jpg
SV 22-173 (ELW)    --> AdobeStock_193248722.jpeg, environmental-protection-683437.jpg, shutterstock_1296270274.jpg
```

### No Slider Images Found
No category slider exists for these â not mapped:
EFH 22-141-190, EFH 22-162-190, EFH 22-173-190, EFH 25-168-190, EFH 28-182-170, EFH 28-194-170,
EFH 35-146-150, EFH 35-181-150, EFH 35-181-150 ELW, EFH 38-115-125, EFH 38-128-125, EFH 38-138-125,
EFH 45-139-75, GH 264-28-160 (ELW), KUBUS 0-145, KUBUS 0-166, KUBUS 0-173, KUBUS 0-190, KUBUS 0-278,
ZFH 282-22-0

---

## DB Replacement Tasks

These are ordered image replacements in `model_media`. Column: `order`. Hero (`order = 1`) is **never touched**.

| House Model | Target Order | Replace With |
|---|---|---|
| Bestseller Family 150 | 5 | `shutterstock_1107072644.jpg` |
| Bestseller Komfort 116 | 3 | `shutterstock_485712322.jpg` |
| Bestseller Twin 138 | 2 | `shutterstock_167874614.jpg` |
| Bestseller Twin 138 | 3 | `shutterstock_167874614.jpg` |
| Bestseller Weitblick 140 | 3 | `neues-bild_nachhaltigkeit.jpg` |
| Bestseller Weitblick 140 | 4 | `shutterstock_1107072644.jpg` |
