import { ITokenList, ITokenListToken, TokenListName } from './tokenLists.slice';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { ethToken } from 'services/web3/config';
import { uniqBy } from 'lodash';
import { utils } from 'ethers';
import { Address } from 'services/web3/types';

const ETH = {
  address: ethToken,
  symbol: 'ETH',
  name: 'Ethereum',
  logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
};

export const getSelectedTokenList = createSelector(
  [
    (state: RootState) => state.tokenLists.tokenLists,
    (state: RootState) => state.tokenLists.selectedTokenList,
  ],
  (
    tokenLists: ITokenList[],
    selected: TokenListName[]
  ): Map<Address, ITokenListToken> => {
    if (!selected.length) {
      return new Map();
    }

    const selectedTokenLists = tokenLists.filter((list) =>
      selected.some((id) => id === list.name)
    );
    const merged = selectedTokenLists.flatMap((list) => list.tokens);
    const uniqueTokens = uniqBy(merged, (tlToken) => tlToken.address);
    const tokensWithEth = [ETH, ...uniqueTokens];
    const normalized: ITokenListToken[] = tokensWithEth.map((token) => {
      return { ...token, address: utils.getAddress(token.address) };
    });

    return new Map(normalized.map((token) => [token.address, token]));
  }
);

export const getFallbackTokenList = createSelector(
  [
    (state: RootState) => state.tokenLists.tokenLists,
    (state: RootState) => state.tokenLists.fallbackTokenList,
  ],
  (
    tokenLists: ITokenList[],
    fallback: TokenListName
  ): Map<Address, ITokenListToken> => {
    const list = tokenLists.find((list) => list.name === fallback);
    if (!list) {
      return new Map();
    }

    const tlFallback: ITokenListToken[] = [ETH, ...list.tokens];
    const normalized: ITokenListToken[] = tlFallback.map((token) => {
      return { ...token, address: utils.getAddress(token.address) };
    });

    return new Map(normalized.map((token) => [token.address, token]));
  }
);
