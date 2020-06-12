import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

type TitleAndMetaTagsProps = {
  url?: string;
  pathname?: string;
  title?: string;
  description?: string;
};

export default function TitleAndMetaTags({
  url = 'https://sinchang.me',
  pathname,
  title = 'Jeff Wen aka sinchang',
  description = 'A Frontend developer from Shanghai',
}: TitleAndMetaTagsProps) {
  const router = useRouter();

  const path = pathname || router.pathname;
  const domain = `${url}${path}`;

  return (
    <Head>
      <title>
        {title} — {description}
      </title>

      <meta name="robots" content="noindex" />

      <meta property="og:url" content={domain} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      <meta name="twitter:url" content={domain} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:site" content="@sinchangwen" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@sinchangwen" />
    </Head>
  );
}
