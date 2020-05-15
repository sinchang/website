export type FrontMatter = {
  layout?: string;
  title: string;
  publishedAt: string;
  draft?: boolean;
  readingTime?: { text: string; minutes: number; time: number; words: number };
  id?: string;
  __resourcePath: string;
};
