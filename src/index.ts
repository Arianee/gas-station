import axios from 'axios';
import promiseRetry from 'promise-retry';
import BigNumber from 'bignumber.js';

export const retryExecFactory = async (func, retries = 3):Promise<any> => {
  return promiseRetry((retry, number) => {
    return func()
      .catch(retry);
  }, { retries });
};

export const CHAIN_GAS_STATION_V1 = {
  1: {
    url: 'https://ethgasstation.info/api/ethgasAPI.json?',
    modifiers: [(data) => ({
      blockNumber: data.blockNum,
      standard: new BigNumber(data.average).div(10).toNumber(),
      safeLow: new BigNumber(data.safeLow).div(10).toNumber(),
      fast: new BigNumber(data.fast).div(10).toNumber(),
      fastest: new BigNumber(data.fastest).div(10).toNumber()
    })]
  },
  80001: {
    url: 'https://gasstation-mainnet.matic.network'
  },
  137: {
    url: 'https://gasstation-mainnet.matic.network/V1'
  },
  77: {
    url: 'https://cert.arianee.org/gasStation/testnet.json'
  },
  99: {
    url: 'https://cert.arianee.org/gasStation/mainnet.json'
  }
};

export interface GAS_STATION {
  'safeLow': number,
  'standard': number,
  'fast': number,
  'fastest': number,
  'blockTime': number,
  'blockNumber': number
}

export const fetchGasStation = async (chainId: string | number):Promise<GAS_STATION> => {
  const obj = CHAIN_GAS_STATION_V1[chainId.toString()];
  if (!obj) {
    throw new Error(`this chain is not handle ${chainId}`);
  }
  const { url, modifiers } = obj;
  const response = await retryExecFactory(() => axios.get(url));
  const { data } = response;
  let modifiedData = data;

  if (modifiers) {
    for (var modifier of modifiers) {
      modifiedData = modifier(modifiedData);
    }
  }

  return modifiedData;
};
