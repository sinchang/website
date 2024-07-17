import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import { Space_Grotesk } from 'next/font/google'
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useHydrateAtoms } from 'jotai/utils'
import { useRouter } from 'next/router'
import { globalAtom } from '../store'
import { Header } from '../components/Header'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})
const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  const { initialState } = pageProps
  const router = useRouter()

  useHydrateAtoms(initialState ? [[globalAtom, initialState]] : [])

  return (
    <>
      <Head>
        <title>Jeff Wen</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <ThemeProvider enableSystem={false} defaultTheme="dark">
            <Script
              src="https://umami-sinchang.vercel.app/script.js"
              data-website-id="a22d725d-fab9-46ed-9fdc-00b595b9d3d1"
              strategy='afterInteractive'
            />
            { router.pathname !== '/swarm' && <Header /> }
            <main className={`${spaceGrotesk.variable} font-sans`}>
              <Component {...pageProps} />
            </main>
          </ThemeProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </>
  )
}
export default MyApp
