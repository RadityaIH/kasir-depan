import Layout from '@/components/layout/layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  const route = useRouter()
  return (
    <>
    {route.pathname.includes("/kasir") ? (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    ): <Component {...pageProps} />}
    </>
  ) 
}
