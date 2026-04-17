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
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// House Details (1:1 with house_models presumably)
export const houseDetails = boholzSchema.table("house_details", {
  id: uuid("id").primaryKey().notNull(), // Assuming this references house_models.id
  levelCount: smallint("level_count"),
  bedroomCount: smallint("bedroom_count"),
  bathroomCount: smallint("bathroom_count"),
  familiesCount: smallint("families_count"),
});

// House Images
export const houseImages = boholzSchema.table("house_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  houseId: uuid("house_id").references(() => houseModels.id),
  url: text("url").notNull(),
  isHero: boolean("is_hero").default(false),
  sortOrder: integer("sort_order").default(0),
});

// Floor plans
export const houseFloor = boholzSchema.table("house_floor", {
  id: uuid("id").primaryKey().defaultRandom(),
  houseModel: uuid("house_model")
    .references(() => houseModels.id)
    .defaultRandom(),
  title: varchar("title"),
  order: smallint("order"),
  imageUrl: text("image_url"),
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

// Media (Shared table)
export const media = boholzSchema.table("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  alt: text("alt"),
  width: integer("width"),
  height: integer("height"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Agent Media
export const agentMedia = boholzSchema.table("agent_media", {
  agentId: uuid("agent_id").notNull(),
  mediaId: uuid("media_id").notNull(),
  label: varchar("label"),
  sortOrder: integer("sort_order").default(0),
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

// Showhouse Agents (M:N)
export const showhouseAgents = boholzSchema.table("showhouse_agents", {
  agentId: uuid("agent_id").notNull(),
  showhouseId: uuid("showhouse_id").notNull(),
  isPrimary: boolean("is_primary").default(false),
  sortOrder: integer("sort_order").default(0),
});

// --- Relations ---
export const houseModelsRelations = relations(houseModels, ({ many, one }) => ({
  category: one(houseCategories, {
    fields: [houseModels.categoryId],
    references: [houseCategories.id],
  }),
  details: one(houseDetails, {
    fields: [houseModels.id],
    references: [houseDetails.id],
  }),
  images: many(houseImages),
  floors: many(houseFloor),
}));

export const houseImagesRelations = relations(houseImages, ({ one }) => ({
  model: one(houseModels, {
    fields: [houseImages.houseId],
    references: [houseModels.id],
  }),
}));

export const houseFloorRelations = relations(houseFloor, ({ one }) => ({
  model: one(houseModels, {
    fields: [houseFloor.houseModel],
    references: [houseModels.id],
  }),
}));
