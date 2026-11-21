export type MediaType = "img" | "vid" | "doc";

export interface MediaConfig {
  base: string;
}

export function createMedia({ base }: MediaConfig) {
  const root = base.replace(/\/+$/, "");

  return {
    url: (type: MediaType, key: string) => `${root}/${type}/${key}`,
  };
}

export interface ImageRef {
  key: string;
  width: number;
  height: number;
  alt: string;
}
