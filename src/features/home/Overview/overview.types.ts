export interface OverviewCardImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface OverviewCardData {
  heading: string;
  subheading?: string;
  image?: OverviewCardImage;
  featured?: boolean;
}
