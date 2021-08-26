import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import numeral from 'numeral';
import { EthNetworks } from 'services/web3/types';

const oneMillion = new BigNumber(1000000);

export const ppmToDec = (ppm: string) => new BigNumber(ppm).div(oneMillion);

export const prettifyNumber = (
  num: number | string | BigNumber,
  usd = false
): string => {
  const bigNum = new BigNumber(num);
  if (usd) {
    if (bigNum.lte(0)) return '$0.00';
    else if (bigNum.lt(0.01)) return '< $0.01';
    else if (bigNum.gt(100)) return numeral(bigNum).format('$0,0', Math.floor);
    else return numeral(bigNum).format('$0,0.00', Math.floor);
  } else {
    if (bigNum.lte(0)) return '0';
    else if (bigNum.gte(1000)) return numeral(bigNum).format('0,0', Math.floor);
    else if (bigNum.gte(2))
      return numeral(bigNum).format('0,0.[00]', Math.floor);
    else if (bigNum.lt(0.000001)) return '< 0.000001';
    else return numeral(bigNum).format('0.[000000]', Math.floor);
  }
};

export const formatDuration = (duration: plugin.Duration): string => {
  let sentence = '';
  const days = duration.days();
  const minutes = duration.minutes();
  const hours = duration.hours();
  if (days > 0) sentence += days + ' Days';
  if (hours > 0) sentence += ' ' + hours + ' Hours';
  if (minutes > 0) sentence += ' ' + minutes + ' Minutes';
  return sentence;
};

export const rewindBlocksByDays = (
  currentBlock: number,
  days: number,
  secondsPerBlock = 13.3
) => {
  if (!Number.isInteger(currentBlock))
    throw new Error('Current block should be an integer');
  const secondsToRewind = dayjs.duration(days, 'days').asSeconds();
  const blocksToRewind = parseInt(String(secondsToRewind / secondsPerBlock));
  return currentBlock - blocksToRewind;
};

export const getNetworkName = (network: EthNetworks): string => {
  switch (network) {
    case EthNetworks.Mainnet:
      return 'Ethereum Mainnet';
    case EthNetworks.Ropsten:
      return 'Ropsten Test Network';
    default:
      return 'Unsupported network';
  }
};

export const isUnsupportedNetwork = (
  network: EthNetworks | undefined
): boolean => {
  return network !== undefined && EthNetworks[network] === undefined;
};
