import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'
import '../assets/_app.css'
import { client } from '../context/wagmi'
import { AuthContextProvider } from '../context/AuthContext'
import { MerchContextProvider } from '../context'

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return (
    <WagmiConfig client={client}>
      <NextHead>
        <link rel="icon" href="../images/favicon.ico" />
        <title>Bad A Billiards</title>
      </NextHead>
      <AuthContextProvider >
        <MerchContextProvider >
        {mounted && <Component {...pageProps} />}
        </MerchContextProvider>
      </AuthContextProvider>
    </WagmiConfig>
  )
}

export default App
