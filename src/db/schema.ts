import {
  pgSchema,
  uuid,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  smallint,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const boholzSchema = pgSchema("boholz");

// House Categories
export const houseCategories = boholzSchema.table("house_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull(),
  description: text("description"),
});

// House Models
export const houseModels = boholzSchema.table("house_models", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id").references(() => houseCategories.id),
  title: varchar("title").notNull(),
  slug: varchar("slug").notNull(),
  modelCode: varchar("model_code").notNull(),
  roofPitch: integer("roof_pitch"),
  livingArea: numeric("living_area"),
  totalArea: numeric("total_area"),
  price: numeric("price"),
  description: text("description"),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// House Details (1:1 with house_models)
export const houseDetails = boholzSchema.table("house_details", {
  id: uuid("id")
    .primaryKey()
    .references(() => houseModels.id)
    .notNull(),
  levelCount: smallint("level_count"),
  bedroomCount: smallint("bedroom_count"),
  bathroomCount: smallint("bathroom_count"),
  familiesCount: smallint("families_count"),
  // Dimensions (in meters)
  width: numeric("width"),
  length: numeric("length"),
  height: numeric("height"),
  // Features
  hasGarage: boolean("has_garage").default(false),
});

// Agents
export const agents = boholzSchema.table("agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name").notNull(),
  slug: varchar("slug").notNull(),
  role: varchar("role"),
  phoneNumber: varchar("phone_number"),
  email: varchar("email"),
  bio: text("bio"),
});

// Showhouses
export const showhouses = boholzSchema.table("showhouses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  slug: varchar("slug").notNull(),
  address: text("address"),
  city: varchar("city"),
  country: varchar("country").default("Germany"),
  lat: numeric("lat"),
  lng: numeric("lng"),
});

// =========================================================================
// THE SINGLE SOURCE OF TRUTH FOR ALL MEDIA
// =========================================================================

export const media = boholzSchema.table("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  path: text("path").notNull(), // ONLY table that holds an image path
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
export const floorMedia = boholzSchema.table("floor_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("model_id")
    .references(() => houseModels.id)
    .defaultRandom(),
  mediaId: uuid("media_id")
    .references(() => media.id)
    .notNull(),
  title: varchar("title"),
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

// Showhouse Agents (M:N - Unrelated to media, keeping it safe)
export const showhouseAgents = boholzSchema.table("showhouse_agents", {
  agentId: uuid("agent_id")
    .references(() => agents.id)
    .notNull(),
  showhouseId: uuid("showhouse_id")
    .references(() => showhouses.id)
    .notNull(),
  isPrimary: boolean("is_primary").default(false),
  sortOrder: integer("sort_order").default(0),
});

// --- Relations ---
export const mediaRelations = relations(media, ({ many }) => ({
  modelMedia: many(modelMedia),
  categoryMedia: many(categoryMedia),
  floorMedia: many(floorMedia),
  agentMedia: many(agentMedia),
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
