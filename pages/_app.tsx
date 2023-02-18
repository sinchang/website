import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import { Header } from '../components/Header'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Jeff Wen</title>
      </Head>
      <ThemeProvider enableSystem={false} defaultTheme="dark">
        <Script
          data-website-id="2a683fa7-f0d6-49b6-a2c5-1832c6d5e81b" 
          src="https://umami-production-af5b.up.railway.app/umami.js"
          strategy='afterInteractive'
        />
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
export default MyApp
