import { configureChains, createClient } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { infuraProvider } from 'wagmi/providers/infura'

const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY || '' // Replace with your Infura API key

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, sepolia],
  [
    infuraProvider({ apiKey: infuraApiKey }),
  ],
)

export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_KEY || '',
      },
    }),
  ],
  provider,
  webSocketProvider,
})
