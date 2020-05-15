import { FrontMatter } from '../types';
import { parseISO, format } from 'date-fns';

type XmlProps = { baseUrl: string; title: string; description: string; frontMatters: FrontMatter[] };

export const makeRssXml = ({ baseUrl, title, description, frontMatters }: XmlProps) => {
  const sortedFrontMatters = frontMatters
    .sort((a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)))
    .slice(0, 15);

  const rssItemsXml = makeItemsRss({ baseUrl, frontMatters: sortedFrontMatters });

  return `<?xml version="1.0" ?>
		<rss version="2.0">
			<channel>
					<title>${title}</title>
					<link>${baseUrl}</link>
					<description>${description}</description>
					<language>en</language>
					<lastBuildDate>${format(parseISO(frontMatters[0].publishedAt), 'MMMM dd, yyyy')}</lastBuildDate>
					${rssItemsXml}
			</channel>
		</rss>`;
};

type MakeItemsRssProps = { baseUrl: string; frontMatters: FrontMatter[] };

const makeItemsRss = ({ baseUrl, frontMatters }: MakeItemsRssProps) => {
  let rssItemsXml = '';

  frontMatters.forEach((frontMatter) => {
    rssItemsXml += `
			<item>
				<title>${frontMatter.title}</title>
				<link>${baseUrl}/${frontMatter.id}</link>
				<pubDate>${frontMatter.publishedAt}</pubDate>
			</item>
		`;
  });

  return rssItemsXml;
};
