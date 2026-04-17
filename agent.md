This is a high-stakes brief. If the agent doesn't understand the difference between a Pultdachhaus (Shed/Pent roof) and a Doppelhaus (Semi-detached), the whole gallery logic fails.

I’ve structured this .md to give the agent the "Architectural Eye" it needs. It includes the specific BoHolz categories and a strict logic for handling that public/to-organize mess.
🤖 Agent Brief: BoHolz Asset Intelligence & Organization

📌 1. Project Context

- **Root Directory:** `public/to-organize/`
- **Asset Source:** All raw `.jpg`, `.png`, and `.webp` files.
- **Metadata Source:** `public/to-organize/export.xml` (The WordPress WXR Export). \* _Note to Agent:_ This XML is the source of truth. You must parse this file first to map `attachment_url` to the parent `post_title` and `category`.
  Brand: BoHolz (Premium Prefab home manufacturer from Germany)
  Vibe: Minimalist, High-end, Precision-focused.
  Source Directory: public/to-organize
  Destination: S3-Ready Structured Library

1.  **Parse XML:** Scan `export.xml` for all `<item>` entries where `<wp:post_type>` is `attachment`.
2.  **Extract Relationships:**
    - Locate the `<wp:attachment_url>`. Match the filename in the URL to the physical file in `public/to-organize/`.
    - Trace the `<wp:post_parent>` or the `<title>` to find which house model (e.g., "Stadtvilla 18-140") this image belongs to.
    - Identify the **Category** (e.g., "Pultdachhaus", "Doppelhaus") from the parent post's `<category>` tags.
3.  **Metadata Capture:** Extract the `<wp:meta_value>` for `_wp_attachment_image_alt` to use as the image `alt` text in the final manifest.

The agent must identify and tag images based on these specific architectural categories. If a filename contains these keywords (or the model number associated with them), move them into these high-level category folders.
Category Description Key Identifiers
Einfamilienhaus Single-family homes EFH, einfamilienhaus, single-family
Generationenhaus Multi-generation / Dual living generationenhaus, mehrgenerationen
Pultdachhaus Homes with a pent/shed roof style pultdach, pultdachhaus
Doppelhaus Semi-detached / Duplex doppelhaus, dh, twin-house
Stadtvilla Modern urban villas (2 stories) stadtvilla, villa
Bungalow Single-story living bungalow
🛠 3. Processing Pipeline
Phase A: The Quality Cull (Delete if Fail)

    Dimension Gate: Minimum 1200px on the shortest side.

    File Size Gate: Minimum 100KB.

    Thumbnail Purge: Delete any file containing patterns like -150x150, -768x432, or -scaled. We only want the original high-res source.

    Duplicate Cleanup: If multiple resolutions of the same shot exist, retain only the one with the highest resolution.

Phase B: Mapping & Identification

Match the image to the House Model Code (e.g., 38-115, 18-140).

    If an image cannot be matched to a code, move it to /unknown-assets/ for manual review.

    Identify the Asset Type:

        Hero: The primary exterior render (usually the cleanest shot).

        Gallery: General interior or exterior shots.

        Floorplan: Blueprints, sketches, or 2D/3D top-down views.

🏷 4. Renaming & Formatting Standards

All files must be renamed to ensure SEO performance and S3 compatibility.

Pattern: {category}_{house-slug}_{type}\_{dimensions}.{ext}

    Lowercase only.

    No special characters (Replace ü with ue, ö with oe, ä with ae, ß with ss).

    Format: webp is preferred, jpg is acceptable.

Example Names:

    einfamilienhaus_38-115-125_hero_2560x1440.webp

    pultdachhaus_22-157_floorplan_1800x1200.jpg

    doppelhaus_0-278_gallery_1920x1080.webp

📂 5. Target Folder Structure

The agent will build this structure from scratch:
Plaintext

/sorted-assets/
/einfamilienhaus/
/[house-slug]/
/hero/
/gallery/
/floor-plans/
/generationenhaus/
/[house-slug]/
...
/pultdachhaus/
/[house-slug]/
...
/doppelhaus/
/[house-slug]/
...

🚀 6. Final Execution Instructions

    Metadata: Strip all EXIF data (GPS, camera settings) but preserve ICC color profiles.

    Path Sanitization: Remove all WordPress-specific date folders (/2023/05/).

    Manifest Generation: Create a manifest.json at the root of /sorted-assets/ mapping every house slug to its image array for easy Drizzle/Postgres import.

    ## 🧠 7. Autonomous Contributions & Heuristics

**Creative Liberty:** The agent is encouraged to act as a Senior Digital Asset Manager.

- **Categorization Intelligence:** If you encounter a house style not explicitly listed (e.g., "Modularhaus"), you are authorized to create a new category folder and document the reasoning.
- **Metadata Enrichment:** If you can infer the material (e.g., "Holzfassade") or color palette from the image, append this to the `manifest.json` as extra tags.
- **Process Optimization:** If you find a more efficient way to handle the sorting or a conflict in the logic, append a `NOTES.md` in the root of the output folder explaining the adjustment.
- **Brief Evolution:** If this `agent.md` is missing a critical architectural detail, you are permitted to "Draft an updated version" for the next run.
