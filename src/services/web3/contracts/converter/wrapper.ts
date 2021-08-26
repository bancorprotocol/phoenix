import Web3 from 'web3';
import { CallReturn } from 'eth-multicall';
import { ContractSendMethod } from 'web3-eth-contract';
import { ContractMethods } from 'services/web3/types';
import { buildContract } from 'services/web3/contracts';
import { ABIConverter } from 'services/web3/contracts/converter/abi';
import { Pool } from 'services/api/bancor';

export const buildConverterContract = (
  contractAddress?: string,
  web3?: Web3
): ContractMethods<{
  reserveBalances: () => CallReturn<any>;
  acceptTokenOwnership: () => ContractSendMethod;
  reserves: (reserveAddress: string) => CallReturn<any[]>;
  reserveBalance: (reserveAddress: string) => CallReturn<string>;
  getConnectorBalance: (reserveAddress: string) => CallReturn<string>;
  getReserveBalance: (reserveAdress: string) => CallReturn<string>;
  acceptOwnership: () => ContractSendMethod;
  fund: (fundAmount: string) => ContractSendMethod;
  liquidate: (fundAmount: string) => ContractSendMethod;
  setConversionFee: (ppm: string) => ContractSendMethod;
  addReserve: (
    reserveAddress: string,
    connectorWeight: number
  ) => ContractSendMethod;
  getSaleReturn: (
    toAddress: string,
    wei: string
  ) => CallReturn<{ '0': string; '1': string }>;
  getReturn: (
    fromTokenAddress: string,
    toTokenAddress: string,
    wei: string
  ) => CallReturn<{ '0': string; '1': string }>;
  owner: () => CallReturn<string>;
  version: () => CallReturn<string>;
  connectorTokenCount: () => CallReturn<string>;
  connectorTokens: (index: number) => CallReturn<string>;
  conversionFee: () => CallReturn<string>;
  geometricMean: (weis: string[]) => CallReturn<string>;
}> => buildContract(ABIConverter, contractAddress, web3);

export const fetchPoolReserveBalances = async (
  pool: Pool,
  blockHeight?: number
) => {
  const contract = buildConverterContract(pool.converter_dlt_id);
  return Promise.all(
    pool.reserves.map(async (reserve) => {
      const weiAmount = await contract.methods
        .getConnectorBalance(reserve.address)
        .call(undefined, blockHeight);

      return {
        contract: reserve.address,
        weiAmount,
      };
    })
  );
};
