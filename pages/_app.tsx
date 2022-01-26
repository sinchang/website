import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import { Header } from '../components/Header'

function MyApp({ Component, pageProps }: AppProps) {
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
