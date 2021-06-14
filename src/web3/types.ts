import { Contract } from 'web3-eth-contract';

export type EthAddress = string;

export interface ContractMethods<T> extends Contract {
  methods: T;
}

export enum EthNetworks {
  Mainnet = 1,
  Ropsten = 3,
}

export interface RegisteredContracts {
  BancorNetwork: string;
  BancorConverterRegistry: string;
  LiquidityProtection: string;
  LiquidityProtectionStore: string;
  StakingRewards: string;
}

export interface ConverterAndAnchor {
  converterAddress: string;
  anchorAddress: string;
}

export interface MinimalPool {
  anchorAddress: string;
  converterAddress: string;
  reserves: string[];
}

export interface ViewToken {
  symbol: string;
  name: string;
  logoURI: string;
}

export interface ViewPool {}
