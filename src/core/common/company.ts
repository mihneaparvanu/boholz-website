export type Address = {
  streetName: string;
  streetNumber?: string;
  postalCode?: string;
  locality: string;
  region?: string;
  country: string;
};

export type Phone = {
  label: string;
  number: string;
};

type SocialPlatforms =
  "facebook" | "instagram" | "tiktok" | "pinterest" | "linkedin";

type SocialPlatformsUrls = Partial<Record<SocialPlatforms, string>>;

export type Company = {
  name: string;
  legalName?: string;
  url: string;
  email: string;
  phones: readonly Phone[];
  address: Address;
  socialUrls?: SocialPlatformsUrls;
  rasterLogoUrl?: string;
};
