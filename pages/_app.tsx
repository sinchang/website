import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Jeff Wen</title>
      </Head>
      <ThemeProvider enableSystem={false} defaultTheme="dark">
        <Script
          src="https://umami-sinchang.vercel.app/script.js"
          data-website-id="a22d725d-fab9-46ed-9fdc-00b595b9d3d1"
          strategy='afterInteractive'
        />
        <main className={`${spaceGrotesk.variable} min-h-screen bg-white font-sans dark:bg-sys-bg-base`}>
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </>
  )
}
export default MyApp
