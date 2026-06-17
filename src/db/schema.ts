import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  numeric,
  pgSchema,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";

export const boholzSchema = pgSchema("boholz");

// House Categories
export const houseCategories = boholzSchema.table("house_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(),
  description: text("description"),
});

/**
 * House Models — front-end-driving record per typology model.
 *
 * Field-purpose layout (mirrors the canonical client PDF
 * `dev/todo/houses/hausliste-homepage.md`):
 *
 *   1. Identity            — id, categoryId, title, slug, modelCode
 *   2. PDF spec columns    — livingArea (Wohnfläche), roofPitch (Dachneigung)
 *   3. Bestseller-only     — price (only Bestseller rows carry a price in the PDF)
 *   4. Body copy           — description
 *   5. Bestseller toggle   — isFeatured (bestseller membership; see lib/bestseller.ts)
 *   6. Back-office only    — totalArea (Bruttofläche; not in the spec, not surfaced
 *                            in UI; kept for internal reporting only)
 *   7. Bookkeeping         — createdAt
 */
export const houseModels = boholzSchema.table("house_models", {
  // 1. Identity
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id").references(() => houseCategories.id),
  title: varchar("title").notNull(),
  slug: varchar("slug").notNull(),
  modelCode: varchar("model_code").notNull(),

  // 2. PDF spec columns — surfaced on the detail page + filter
  livingArea: numeric("living_area"),
  roofPitch: integer("roof_pitch"),

  // 3. Bestseller-only — only rendered for category === 'bestseller'
  price: numeric("price"),

  // 4. Body copy
  description: text("description"),

  // 5. Bestseller toggle — see src/lib/bestseller.ts
  isFeatured: boolean("is_featured").default(false),

  // 6. Back-office only — not on detail page, not in filters
  totalArea: numeric("total_area"),

  // 7. Bookkeeping
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/**
 * House Details — 1:1 supplement to a HouseModel.
 *
 * Field-purpose layout:
 *
 *   1. Identity              — id (== houseModels.id)
 *   2. PDF spec columns      — floorCount, roofType, kniestock, netFloorAreaDin,
 *                              totalLivingAreaWoflv, extensionDescription,
 *                              allowsGrannyFlat. These power DetailsGrid + filter.
 *   3. Legacy / deprecated   — levelCount (smallint, can't hold 1.5 — kept until
 *                              the last call-site migrates to floorCount).
 *   4. Back-office only      — bedroomCount, bathroomCount, familiesCount,
 *                              width, length, height, hasGarage (legacy boolean
 *                              superseded by extensionDescription), isBarrierFree,
 *                              hasChildrenRoom. Kept for internal use, NOT
 *                              surfaced on the detail page or in filters per
 *                              `hausliste-homepage.md` § "Filter & Detail spec".
 */
export const houseDetails = boholzSchema.table("house_details", {
  // 1. Identity (FK == house_models.id)
  id: uuid("id")
    .primaryKey()
    .references(() => houseModels.id)
    .notNull(),

  // 2. PDF spec columns — surfaced on the detail page + filter
  /** Geschosse — accepts 1, 1.5, 2 (numeric since smallint can't hold 1.5). */
  floorCount: numeric("floor_count"),
  /** Dachform — Satteldach / Walmdach / Pultdach / Flachdach / "Flachdach, Attika". */
  roofType: varchar("roof_type"),
  /** Knee-wall height in cm; null = no kniestock. */
  kniestock: smallint("kniestock"),
  /** Net floor area per DIN 277 (m²). */
  netFloorAreaDin: numeric("net_floor_area_din"),
  /** Total living area per Wohnflächenverordnung (m²) — legally-binding number. */
  totalLivingAreaWoflv: numeric("total_living_area_woflv"),
  /** Anbau — free text describing any extension ("Erker 38°", "Garage", null). */
  extensionDescription: varchar("extension_description"),
  /** True when the floor plan supports an Einliegerwohnung on request. */
  allowsGrannyFlat: boolean("allows_granny_flat").default(false),

  // 3. Legacy / deprecated — use floorCount instead
  /** @deprecated Use {@link floorCount}. Smallint can't hold 1.5. */
  levelCount: smallint("level_count"),

  // 4. Back-office only — NOT in the canonical spec; not in UI / filter
  bedroomCount: smallint("bedroom_count"),
  bathroomCount: smallint("bathroom_count"),
  familiesCount: smallint("families_count"),
  width: numeric("width"),
  length: numeric("length"),
  height: numeric("height"),
  /** @deprecated Superseded by {@link extensionDescription}. */
  hasGarage: boolean("has_garage").default(false),
  isBarrierFree: boolean("is_barrier_free").default(false),
  hasChildrenRoom: boolean("has_children_room").default(false),
});

// Agents
export const agents = boholzSchema.table("agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name").notNull(),
  slug: varchar("slug").notNull(),
  role: varchar("role"),
  phoneNumber: varchar("phone_number"),
  // Second line where a contact carries both a mobile and a shared office
  // number (e.g. Musterhaus Vertriebspartner). Nullable — most agents have one.
  phoneSecondary: varchar("phone_secondary"),
  email: varchar("email"),
  bio: text("bio"),
});

// Locations — physical sites visible on the map.
//   kind = "office"        Vertriebsbüro (regional sales office)
//   kind = "headquarters"  Zentrale
//   kind = "showhouse"     Musterhaus
export const locations = boholzSchema.table("locations", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  slug: varchar("slug").notNull(),
  kind: varchar("kind").notNull().default("office"),
  address: text("address"),
  postalCode: varchar("postal_code"),
  city: varchar("city"),
  country: varchar("country").default("Germany"),
  phone: varchar("phone"),
  email: varchar("email"),
  lat: numeric("lat"),
  lng: numeric("lng"),
});

// =========================================================================
// THE SINGLE SOURCE OF TRUTH FOR ALL MEDIA
// =========================================================================

export const media = boholzSchema.table("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  path: text("path").notNull(),
  alt: text("alt"),
  width: integer("width"),
  height: integer("height"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// =========================================================================
// MEDIA PIVOT TABLES (Many-To-Many / Join Tables)
// =========================================================================

// Category Media
export const categoryMedia = boholzSchema.table("category_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .references(() => houseCategories.id)
    .notNull(),
  mediaId: uuid("media_id")
    .references(() => media.id)
    .notNull(),
  isThumbnail: boolean("is_thumbnail").default(false),
  isHero: boolean("is_hero").default(false),
  sortOrder: integer("sort_order").default(0),
});

// Model Media (Renamed from house_images)
export const modelMedia = boholzSchema.table("model_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("model_id")
    .references(() => houseModels.id)
    .notNull(),
  mediaId: uuid("media_id")
    .references(() => media.id)
    .notNull(),
  isHero: boolean("is_hero").default(false),
  isThumbnail: boolean("is_thumbnail").default(false),
  sortOrder: integer("sort_order").default(0),
});

// Floor Media (Renamed from house_floor for consistency)
// Variant tag for layout / roof / ELW differentiation. Null = default plan.
// Known values: "alternative", "elw", "elw_alternative", "flachdach".
// The UI surfaces a segmented toggle when a model has ≥2 distinct variants.
export const floorMedia = boholzSchema.table("floor_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("model_id")
    .references(() => houseModels.id)
    .defaultRandom(),
  mediaId: uuid("media_id")
    .references(() => media.id)
    .notNull(),
  title: varchar("title"),
  // Null = default; known values: "alternative", "elw", "elw_alternative", "flachdach".
  variant: varchar("variant"),
  sortOrder: smallint("sort_order"),
});

// Agent Media
export const agentMedia = boholzSchema.table("agent_media", {
  agentId: uuid("agent_id")
    .references(() => agents.id)
    .notNull(),
  mediaId: uuid("media_id")
    .references(() => media.id)
    .notNull(),
  label: varchar("label"),
  sortOrder: integer("sort_order").default(0),
});

// Location Media — galleries for showhouses (and any future office/HQ imagery)
export const locationMedia = boholzSchema.table("location_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  locationId: uuid("location_id")
    .references(() => locations.id)
    .notNull(),
  mediaId: uuid("media_id")
    .references(() => media.id)
    .notNull(),
  isHero: boolean("is_hero").default(false),
  isThumbnail: boolean("is_thumbnail").default(false),
  // Free-form role inside the location's gallery — "exterior" | "interior" |
  // "plan" for showhouses; null elsewhere.
  classification: varchar("classification"),
  sortOrder: integer("sort_order").default(0),
});

// Location ↔ Agents (M:N)
export const locationAgents = boholzSchema.table("location_agents", {
  agentId: uuid("agent_id")
    .references(() => agents.id)
    .notNull(),
  locationId: uuid("location_id")
    .references(() => locations.id)
    .notNull(),
  isPrimary: boolean("is_primary").default(false),
  sortOrder: integer("sort_order").default(0),
});

// =========================================================================
// NEWS
// =========================================================================

export const news = boholzSchema.table("news", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  slug: varchar("slug").notNull(),
  excerpt: text("excerpt"),
  // Stored as Markdown
  content: text("content"),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const newsMedia = boholzSchema.table("news_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  newsId: uuid("news_id")
    .references(() => news.id)
    .notNull(),
  mediaId: uuid("media_id")
    .references(() => media.id)
    .notNull(),
  isHero: boolean("is_hero").default(false),
  sortOrder: integer("sort_order").default(0),
});

export const leadFormType = boholzSchema.enum("lead_form_type", [
  "contact",
  "catalog",
]);

export const leads = boholzSchema.table("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  formType: leadFormType("form_type").notNull(),
  payload: jsonb("payload").notNull(),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});

// --- Relations ---
export const mediaRelations = relations(media, ({ many }) => ({
  modelMedia: many(modelMedia),
  categoryMedia: many(categoryMedia),
  floorMedia: many(floorMedia),
  agentMedia: many(agentMedia),
  newsMedia: many(newsMedia),
  locationMedia: many(locationMedia),
}));

export const houseCategoriesRelations = relations(
  houseCategories,
  ({ many }) => ({
    media: many(categoryMedia),
  }),
);

export const houseModelsRelations = relations(houseModels, ({ many, one }) => ({
  category: one(houseCategories, {
    fields: [houseModels.categoryId],
    references: [houseCategories.id],
  }),
  details: one(houseDetails, {
    fields: [houseModels.id],
    references: [houseDetails.id],
  }),
  media: many(modelMedia),
  floors: many(floorMedia),
}));

// Pivot definitions mapping the joints back to the media table
export const modelMediaRelations = relations(modelMedia, ({ one }) => ({
  model: one(houseModels, {
    fields: [modelMedia.modelId],
    references: [houseModels.id],
  }),
  media: one(media, {
    fields: [modelMedia.mediaId],
    references: [media.id],
  }),
}));

export const categoryMediaRelations = relations(categoryMedia, ({ one }) => ({
  category: one(houseCategories, {
    fields: [categoryMedia.categoryId],
    references: [houseCategories.id],
  }),
  media: one(media, {
    fields: [categoryMedia.mediaId],
    references: [media.id],
  }),
}));

export const floorMediaRelations = relations(floorMedia, ({ one }) => ({
  model: one(houseModels, {
    fields: [floorMedia.modelId],
    references: [houseModels.id],
  }),
  media: one(media, {
    fields: [floorMedia.mediaId],
    references: [media.id],
  }),
}));

export const newsRelations = relations(news, ({ many }) => ({
  media: many(newsMedia),
}));

export const newsMediaRelations = relations(newsMedia, ({ one }) => ({
  news: one(news, {
    fields: [newsMedia.newsId],
    references: [news.id],
  }),
  media: one(media, {
    fields: [newsMedia.mediaId],
    references: [media.id],
  }),
}));

export const locationsRelations = relations(locations, ({ many }) => ({
  agents: many(locationAgents),
  media: many(locationMedia),
}));

export const locationMediaRelations = relations(locationMedia, ({ one }) => ({
  location: one(locations, {
    fields: [locationMedia.locationId],
    references: [locations.id],
  }),
  media: one(media, {
    fields: [locationMedia.mediaId],
    references: [media.id],
  }),
}));

export const agentsRelations = relations(agents, ({ many }) => ({
  locations: many(locationAgents),
  media: many(agentMedia),
}));

export const locationAgentsRelations = relations(locationAgents, ({ one }) => ({
  location: one(locations, {
    fields: [locationAgents.locationId],
    references: [locations.id],
  }),
  agent: one(agents, {
    fields: [locationAgents.agentId],
    references: [agents.id],
  }),
}));

export const agentMediaRelations = relations(agentMedia, ({ one }) => ({
  agent: one(agents, {
    fields: [agentMedia.agentId],
    references: [agents.id],
  }),
  media: one(media, {
    fields: [agentMedia.mediaId],
    references: [media.id],
  }),
}));
