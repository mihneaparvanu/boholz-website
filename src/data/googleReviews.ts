/**
 * Google Places (New) reviews loader with a module-level memory cache.
 *
 * - Cache survives across SSR requests as long as the Node process is alive.
 * - TTL defaults to 7 days. Stale-on-error: if a refresh fails, the previous
 *   payload is kept and returned so the UI never empties out on a transient
 *   Google outage.
 * - Returns the mapped view-model shape the UI consumes — Google response
 *   schemas don't leak past this module.
 */

const PLACE_ID = "ChIJXbQM4GBx1IYR32dz7cfj1RE";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 1 week

export interface Review {
  id: string;
  rating: number;
  text: string;
  author: { name: string; imageURL?: string };
  publishTime: string;
}

interface PlacesReview {
  name: string;
  rating: number;
  publishTime: string;
  text?: { text: string; languageCode: string };
  originalText?: { text: string; languageCode: string };
  authorAttribution: {
    displayName: string;
    photoUri?: string;
    uri?: string;
  };
}

interface PlacesResponse {
  reviews?: PlacesReview[];
}

let cache: { data: Review[]; expires: number } | null = null;
let inflight: Promise<Review[]> | null = null;

export async function getGoogleReviews(): Promise<Review[]> {
  if (cache && cache.expires > Date.now()) return cache.data;
  if (inflight) return inflight;

  inflight = fetchAndMap()
    .then((data) => {
      cache = { data, expires: Date.now() + TTL_MS };
      return data;
    })
    .catch((err) => {
      // Fail-soft: log and return whatever we can. Never crash the SSR render.
      console.error("[googleReviews] unexpected error:", err);
      return cache?.data ?? [];
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

async function fetchAndMap(): Promise<Review[]> {
  const key = import.meta.env.GOOGLE_PLACES_API_KEY;
  console.log(
    `[googleReviews] key present=${Boolean(key)} prefix=${key ? key.slice(0, 6) : "n/a"} length=${key?.length ?? 0}`,
  );
  if (!key) {
    console.error("[googleReviews] GOOGLE_PLACES_API_KEY is not set — returning empty list");
    return [];
  }

  const res = await fetch(
    `https://places.googleapis.com/v1/places/${PLACE_ID}`,
    {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews",
      },
    },
  );
  if (!res.ok) {
    const body = await res.text();
    console.error(`[googleReviews] Places API ${res.status} — ${body.slice(0, 400)}`);
    return [];
  }
  const data = (await res.json()) as PlacesResponse;

  return (data.reviews ?? []).map((r) => ({
    id: r.name,
    rating: r.rating,
    text: (r.originalText?.text ?? r.text?.text ?? "").trim(),
    author: {
      name: r.authorAttribution.displayName,
      imageURL: r.authorAttribution.photoUri,
    },
    publishTime: r.publishTime,
  }));
}
