/**
 * Seed: BoHolz Vertriebsbüros + Zentrale + their agents.
 *
 *   npx tsx scripts/seed-locations.ts
 *
 * Idempotent: matches by slug for locations and by slug for agents.
 * Geocodes addresses on first run via OpenStreetMap Nominatim (1 req/s).
 */
import "dotenv/config";
import { db } from "../src/db/db";
import { agents, locations, locationAgents } from "../src/db/schema";
import { eq, and } from "drizzle-orm";

type OfficeSeed = {
  slug: string;
  title: string;
  kind: "office" | "headquarters";
  address: string;
  postalCode: string;
  city: string;
  phone?: string;
  email?: string;
  agents: Array<{
    slug: string;
    fullName: string;
    role: string;
    phoneNumber?: string;
    email?: string;
    isPrimary?: boolean;
  }>;
};

const OFFICES: OfficeSeed[] = [
  {
    slug: "zentrale-bad-kissingen",
    title: "Zentrale Bad Kissingen",
    kind: "headquarters",
    address: "Ostring 1",
    postalCode: "97688",
    city: "Bad Kissingen",
    phone: "+49 971 78555",
    agents: [
      {
        slug: "wilfried-bolz",
        fullName: "Wilfried Bolz",
        role: "Geschäftsführer",
        phoneNumber: "+49 971 78555 715",
        email: "w.bolz@boholz-haus.de",
        isPrimary: true,
      },
      {
        slug: "marcus-rossol",
        fullName: "Marcus Rossol",
        role: "Kalkulation / Projektleitung",
        phoneNumber: "+49 971 78555 716",
        email: "m.rossol@boholz-haus.de",
      },
      {
        slug: "christoph-schmidt",
        fullName: "Christoph Schmidt",
        role: "Kalkulation / Vertrieb",
        phoneNumber: "+49 971 78555 717",
        email: "c.schmidt@boholz-haus.de",
      },
    ],
  },
  {
    slug: "vertriebsbuero-speyer",
    title: "Vertriebsbüro Speyer",
    kind: "office",
    address: "Zum Pfauenturm 5",
    postalCode: "67346",
    city: "Speyer",
    phone: "+49 152 33548855",
    email: "a.bauder@boholz-haus.de",
    agents: [
      {
        slug: "achim-bauder",
        fullName: "Dipl. Ing. Achim Bauder",
        role: "Beratung und Verkauf",
        phoneNumber: "+49 152 33548855",
        email: "a.bauder@boholz-haus.de",
        isPrimary: true,
      },
    ],
  },
  {
    slug: "vertriebsbuero-horb-nordstetten",
    title: "Vertriebsbüro Horb-Nordstetten",
    kind: "office",
    address: "Axel-Lipp-Straße 20",
    postalCode: "72160",
    city: "Horb-Nordstetten",
    phone: "+49 171 1280274",
    email: "d.wissmann@boholz-haus.de",
    agents: [
      {
        slug: "dieter-wissmann",
        fullName: "Dieter Wissmann",
        role: "Fachberater",
        phoneNumber: "+49 171 1280274",
        email: "d.wissmann@boholz-haus.de",
        isPrimary: true,
      },
    ],
  },
  {
    slug: "vertriebsbuero-villingen-schwenningen",
    title: "Vertriebsbüro Villingen-Schwenningen",
    kind: "office",
    address: "Zwergsteigstraße 4",
    postalCode: "78048",
    city: "Villingen-Schwenningen",
    phone: "+49 160 96793331",
    email: "r.flueckiger@boholz-haus.de",
    agents: [
      {
        slug: "ralf-flueckiger",
        fullName: "Ralf Flückiger",
        role: "Fachberater",
        phoneNumber: "+49 160 96793331",
        email: "r.flueckiger@boholz-haus.de",
        isPrimary: true,
      },
    ],
  },
  {
    slug: "vertriebsbuero-bad-mergentheim",
    title: "Vertriebsbüro Bad Mergentheim",
    kind: "office",
    address: "Edelfinger Straße 25/1",
    postalCode: "97980",
    city: "Bad Mergentheim",
    phone: "+49 151 12295890",
    email: "buero.mergentheim@boholz-haus.de",
    agents: [
      {
        slug: "susann-schaefer",
        fullName: "Susann Schaefer",
        role: "Fachberaterin",
        phoneNumber: "+49 151 12295890",
        email: "buero.mergentheim@boholz-haus.de",
        isPrimary: true,
      },
    ],
  },
  {
    slug: "vertriebsbuero-hammelburg",
    title: "Vertriebsbüro Hammelburg",
    kind: "office",
    address: "Zum Bauholz 3",
    postalCode: "97762",
    city: "Hammelburg",
    phone: "+49 176 55179386",
    email: "t.reith@boholz-haus.de",
    agents: [
      {
        slug: "thomas-reith",
        fullName: "Thomas Reith",
        role: "Beratung und Verkauf",
        phoneNumber: "+49 176 55179386",
        email: "t.reith@boholz-haus.de",
        isPrimary: true,
      },
    ],
  },
  {
    slug: "vertriebsbuero-muenchen",
    title: "Vertriebsbüro München",
    kind: "office",
    address: "Tangastraße 31",
    postalCode: "81827",
    city: "München",
    phone: "+49 172 1458561",
    email: "k.kanwischer@boholz-haus.de",
    agents: [
      {
        slug: "klaus-kanwischer",
        fullName: "Klaus Kanwischer",
        role: "Fachberater",
        phoneNumber: "+49 172 1458561",
        email: "k.kanwischer@boholz-haus.de",
        isPrimary: true,
      },
    ],
  },
  {
    slug: "vertriebsbuero-eltville",
    title: "Vertriebsbüro Eltville",
    kind: "office",
    address: "Wiesweg 68b",
    postalCode: "65343",
    city: "Eltville",
    agents: [],
  },
  {
    slug: "vertriebsbuero-tholey-hasborn",
    title: "Vertriebsbüro Tholey-Hasborn",
    kind: "office",
    address: "Auf der Klaus 2a",
    postalCode: "66636",
    city: "Tholey-Hasborn",
    phone: "+49 175 5250487",
    email: "k.wasem@boholz-haus.de",
    agents: [
      {
        slug: "kurt-wasem",
        fullName: "Kurt Wasem",
        role: "Fachberater",
        phoneNumber: "+49 175 5250487",
        email: "k.wasem@boholz-haus.de",
        isPrimary: true,
      },
    ],
  },
  {
    slug: "vertriebsbuero-jockgrim",
    title: "Vertriebsbüro Jockgrim",
    kind: "office",
    address: "Bahnhofstraße 66",
    postalCode: "76751",
    city: "Jockgrim",
    phone: "+49 172 7689327",
    email: "h.hellmann@boholz-haus.de",
    agents: [
      {
        slug: "horst-hellmann",
        fullName: "Horst Hellmann",
        role: "Gebietsverkaufsleiter",
        phoneNumber: "+49 172 7689327",
        email: "h.hellmann@boholz-haus.de",
        isPrimary: true,
      },
      {
        slug: "katja-rodewald-willms",
        fullName: "Katja Rodewald-Willms",
        role: "Beratung und Verkauf",
        phoneNumber: "+49 175 5205284",
        email: "k.rodewald-willms@boholz-haus.de",
      },
    ],
  },
  {
    slug: "vertriebsbuero-mainz",
    title: "Vertriebsbüro Mainz",
    kind: "office",
    address: "Willy-Brandt-Platz 10",
    postalCode: "55122",
    city: "Mainz",
    phone: "+49 176 63383368",
    email: "o.heider@boholz-haus.de",
    agents: [
      {
        slug: "oswin-heider",
        fullName: "Oswin Heider",
        role: "Fachberater",
        phoneNumber: "+49 176 63383368",
        email: "o.heider@boholz-haus.de",
        isPrimary: true,
      },
    ],
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Geocoding — Nominatim usage policy mandates ≤1 req/s and a real User-Agent.
// ────────────────────────────────────────────────────────────────────────────
type LatLng = { lat: string; lng: string };

async function geocode(o: OfficeSeed): Promise<LatLng | null> {
  const q = `${o.address}, ${o.postalCode} ${o.city}, Germany`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "boholz-haus-seed/1.0 (mihnea@sadnights.com)" },
  });
  if (!res.ok) {
    console.warn(`  geocode failed (${res.status}) for ${o.title}`);
    return null;
  }
  const hits = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (hits.length === 0) {
    console.warn(`  no geocode result for ${o.title} (${q})`);
    return null;
  }
  return { lat: hits[0].lat, lng: hits[0].lon };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ────────────────────────────────────────────────────────────────────────────

async function upsertLocation(o: OfficeSeed): Promise<string> {
  const existing = await db
    .select({ id: locations.id, lat: locations.lat, lng: locations.lng })
    .from(locations)
    .where(eq(locations.slug, o.slug));

  let coords: LatLng | null = null;
  if (existing[0] && existing[0].lat && existing[0].lng) {
    coords = { lat: existing[0].lat, lng: existing[0].lng };
  } else {
    coords = await geocode(o);
    await sleep(1100);
  }

  const values = {
    title: o.title,
    slug: o.slug,
    kind: o.kind,
    address: o.address,
    postalCode: o.postalCode,
    city: o.city,
    country: "Germany",
    phone: o.phone ?? null,
    email: o.email ?? null,
    lat: coords?.lat ?? null,
    lng: coords?.lng ?? null,
  };

  if (existing.length > 0) {
    await db.update(locations).set(values).where(eq(locations.id, existing[0].id));
    console.log(`  updated location: ${o.title}`);
    return existing[0].id;
  }
  const [row] = await db.insert(locations).values(values).returning({ id: locations.id });
  console.log(`  inserted location: ${o.title}`);
  return row.id;
}

async function upsertAgent(a: OfficeSeed["agents"][number]): Promise<string> {
  const existing = await db.select({ id: agents.id }).from(agents).where(eq(agents.slug, a.slug));
  const values = {
    fullName: a.fullName,
    slug: a.slug,
    role: a.role,
    phoneNumber: a.phoneNumber ?? null,
    email: a.email ?? null,
    bio: null,
  };
  if (existing.length > 0) {
    await db.update(agents).set(values).where(eq(agents.id, existing[0].id));
    console.log(`    updated agent: ${a.fullName}`);
    return existing[0].id;
  }
  const [row] = await db.insert(agents).values(values).returning({ id: agents.id });
  console.log(`    inserted agent: ${a.fullName}`);
  return row.id;
}

async function linkAgent(
  locationId: string,
  agentId: string,
  isPrimary: boolean,
  sortOrder: number,
) {
  const existing = await db
    .select()
    .from(locationAgents)
    .where(and(eq(locationAgents.locationId, locationId), eq(locationAgents.agentId, agentId)));
  if (existing.length > 0) return;
  await db.insert(locationAgents).values({ locationId, agentId, isPrimary, sortOrder });
}

console.log("=== Seeding locations + agents ===\n");

for (const office of OFFICES) {
  console.log(`▸ ${office.title}`);
  const locationId = await upsertLocation(office);
  for (let i = 0; i < office.agents.length; i++) {
    const a = office.agents[i];
    const agentId = await upsertAgent(a);
    await linkAgent(locationId, agentId, !!a.isPrimary, i);
  }
}

console.log("\nDone ✓");
process.exit(0);
