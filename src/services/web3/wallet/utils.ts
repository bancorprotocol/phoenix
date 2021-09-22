import { Web3Provider } from '@ethersproject/providers';
import { AbstractConnector } from '@web3-react/abstract-connector';
import {
  injected,
  walletconnect,
  walletlink,
  ledger,
  trezor,
  lattice,
  frame,
  fortmatic,
  portis,
  torus,
} from 'services/web3/wallet/connectors';
import metamaskLogo from 'assets/logos/metamask.png';
import fortmaticLogo from 'assets/logos/fortmatic.svg';
import portisLogo from 'assets/logos/portis.png';
import walletConnectLogo from 'assets/logos/walletConnect.svg';
import coinbaseWalletLogo from 'assets/logos/coinbaseWallet.svg';
import ledgerLogo from 'assets/logos/ledger.svg';
import trezorLogo from 'assets/logos/trezor.svg';
import frameLogo from 'assets/logos/frame.png';
import lattisLogo from 'assets/logos/lattis.png';
import torusLogo from 'assets/logos/torus.svg';

export const getLibrary = (provider: any): Web3Provider => {
  const library = new Web3Provider(
    provider,
    typeof provider.chainId === 'string'
      ? parseInt(provider.chainId)
      : typeof provider.chainId === 'number'
      ? provider.chainId
      : 'any'
  );
  library.pollingInterval = 15000;
  return library;
};

export interface WalletInfo {
  connector: AbstractConnector;
  name: string;
  description: string;
  icon: string;
  href?: string;
}

export const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    connector: injected,
    name: 'MetaMask',
    icon: metamaskLogo,
    description: 'MetaMask description',
  },
  {
    connector: walletconnect,
    name: 'WalletConnect',
    icon: walletConnectLogo,
    description: 'WalletConnect description',
  },
  {
    connector: walletlink,
    name: 'Coinbase Wallet',
    icon: coinbaseWalletLogo,
    description: 'Coinbase Wallet description',
  },
  {
    connector: ledger,
    name: 'Ledger',
    icon: ledgerLogo,
    description: 'Ledger description',
  },
  {
    connector: trezor,
    name: 'Trezor',
    icon: trezorLogo,
    description: 'Trezor description',
  },
  {
    connector: lattice,
    name: 'Lattice',
    icon: lattisLogo,
    description: 'Lattice description',
  },
  {
    connector: frame,
    name: 'Frame',
    icon: frameLogo,
    description: 'Frame description',
  },
  {
    connector: fortmatic,
    name: 'Fortmatic',
    icon: fortmaticLogo,
    description: 'Fortmatic description',
  },
  {
    connector: portis,
    name: 'Portis',
    icon: portisLogo,
    description: 'Portis description',
  },
  {
    connector: torus,
    name: 'Torus',
    icon: torusLogo,
    description: 'Torus description',
  },
];
