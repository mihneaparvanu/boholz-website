export type Image = {
  path: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  isAi: boolean;
};

export type AttachedImage = Image & {
  isHero: boolean;
};

export type FloorPlan = Image & {
  title: string;
  variant: string | null;
};
