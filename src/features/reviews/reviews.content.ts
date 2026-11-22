export interface Review {
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  author: { name: string; imageURL?: string };
  /** ISO date, YYYY-MM-DD. Not rendered; documents when it was written. */
  date: string;
}

export const reviews: Review[] = [];
