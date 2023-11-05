import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  polygonMumbai
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import Nav from './nav';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Lenspost Task',
  projectId: "b6decb5ab7daa1d99d9d0f9202e589c5",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Nav />
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
