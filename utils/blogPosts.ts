// @ts-ignore
import { frontMatter } from '../pages/blog/**/*.mdx';
import { FrontMatter } from '../types';

export const blogPosts: FrontMatter[] = frontMatter.sort(
  (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
);
