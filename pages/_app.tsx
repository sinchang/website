import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import NextLink from 'next/link';
import { MDXProvider } from '@mdx-js/react';
import { createGlobalStyle } from 'styled-components';
import * as Radix from '@modulz/radix';
import { prismTheme } from '../prismTheme';
import { useAnalytics } from '../utils/analytics';
import { Footer } from '../components/Footer';
import { CardPlayground } from '../components/CardPlayground';

const theme = Radix.theme;

// Create global CSS for syntax highlighting
export const GlobalStyles = createGlobalStyle(
  {
    body: {
      color: theme.colors.white,
      fontFamily: theme.fonts.normal,
      margin: 0,
    },

    ul: {
      paddingLeft: theme.space[4],
    },

    figure: { margin: 0 },

    svg: { display: 'inline-block', verticalAlign: 'middle' },
  },
  prismTheme
);

function App({ Component, pageProps }: AppProps) {
  useAnalytics();
  return (
    <Radix.RadixProvider>
      <MDXProvider
        components={{
          ...Radix,
          h1: (props) => <Radix.Text size={7} mb={5} weight="medium" {...props} as="h1" />,
          h2: (props) => <Radix.Text size={5} mt={5} mb={4} mx="auto" weight="medium" {...props} as="h2" />,
          h3: (props) => <Radix.Text size={3} mt={5} mb={3} mx="auto" weight="medium" {...props} as="h3" />,
          h4: (props) => <Radix.Text size={3} mt={4} mb={3} mx="auto" weight="medium" {...props} as="h4" />,
          p: (props) => <Radix.Text mb={4} {...props} size={4} as="p" />,
          a: ({ href = '', ...props }) => {
            if (href.startsWith('/')) {
              return (
                <NextLink href={href} passHref>
                  <Radix.Link {...props} />
                </NextLink>
              );
            }
            return <Radix.Link href={href} {...props} />;
          },
          hr: (props) => <Radix.Divider my={5} size={1} align="left" {...props} />,
          inlineCode: (props) => <Radix.Code {...props} />,
          ul: (props) => <Radix.Box mb={4} {...props} as="ul" />,
          ol: (props) => <Radix.Box mb={4} {...props} as="ol" />,
          li: (props) => (
            <li>
              <Radix.Text {...props} size={4} />
            </li>
          ),
          strong: (props) => <Radix.Text {...props} weight="bold" sx={{ ...props.sx }} />,
          Image: ({ children, ...props }) => (
            <Radix.Box as="figure" mx={[-3, -5]} my={5}>
              <img style={{ maxWidth: '100%', verticalAlign: 'middle' }} {...props} />
              {children && (
                <Radix.Box as="figcaption">
                  <Radix.Text
                    as="figcaption"
                    sx={{ textAlign: 'center', fontSize: 1, lineHeight: 1, fontFamily: 'mono', color: 'gray' }}
                  >
                    {children}
                  </Radix.Text>
                </Radix.Box>
              )}
            </Radix.Box>
          ),
          video: (props) => (
            <Radix.Box
              mx={[-3, -5]}
              my={4}
              sx={{
                border: (theme) => `1px solid ${theme.colors.gray300}`,
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <video {...props} autoPlay playsInline muted loop style={{ width: '100%', display: 'block' }}></video>
            </Radix.Box>
          ),
          iframe: ({ ...props }) => (
            <Radix.Box mb={4}>
              <iframe {...props} />
            </Radix.Box>
          ),
          blockquote: (props) => (
            <Radix.Box
              my={4}
              pl={4}
              sx={{ fontSize: 0, borderLeft: (theme) => `2px solid ${theme.colors.gray}`, color: 'gray' }}
              {...props}
            />
          ),
          pre: (props) => (
            <Radix.Box
              mx={[-4, 0]}
              mt={3}
              mb={5}
              p={3}
              sx={{
                borderRadius: [0, 2],
                bg: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontFamily: 'mono',
                fontSize: 3,
                lineHeight: 3,
                overflow: 'auto',
              }}
            >
              <pre {...props} />
            </Radix.Box>
          ),
          CardPlayground: CardPlayground,
        }}
      >
        <Head>
          <title>Jeff Wen aka sinchang</title>
          <link rel="icon" href="/favicon.png" />
          <link href="https://fonts.googleapis.com/css?family=Inter:400,500,600,700&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css?family=Fira+Mono&display=swap" rel="stylesheet" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>

        <GlobalStyles />

        <Radix.Flex sx={{ minHeight: '100vh', flexDirection: 'column' }}>
          <Radix.Box sx={{ flex: 1 }}>
            <Component {...pageProps} />
          </Radix.Box>

          <Footer />
        </Radix.Flex>
      </MDXProvider>
    </Radix.RadixProvider>
  );
}

export default App;
