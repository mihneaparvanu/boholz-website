export type Image = {
  path: string;
  alt: string | null;
  width: number;
  height: number;
  isAi: boolean;
};

export type AttachedImage = Image & {
  isHero: boolean;
};

export type FloorPlan = Image & {
  title: string;
  variant: string;
};
