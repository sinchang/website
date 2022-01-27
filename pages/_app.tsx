import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import { useAnalytics } from '@happykit/analytics'
import { Header } from '../components/Header'

function MyApp({ Component, pageProps }: AppProps) {
  useAnalytics({ publicKey: 'analytics_pub_dbf227c70c' })
  return (
    <>
      <Head>
        <title>Jeff Wen</title>
      </Head>
      <ThemeProvider enableSystem={false} defaultTheme="dark">
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
export default MyApp
