export type OgImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export type OgType = "website" | "product" | "article";

export type PageMetadata = {
  title: string;
  description: string;
  ogImage?: OgImage;
  ogType?: OgType;
};

export type Metadata = Pick<PageMetadata, "title" | "description"> & {
  urls: {
    canonical: string;
    alternates: Record<string, string>;
    xDefault: string;
  };
  og: {
    title: string;
    description: string;
    locale: string;
    url: string;
    image: OgImage;
    type: OgType;
  };
};
