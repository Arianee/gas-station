import axios from 'axios';
import promiseRetry from 'promise-retry';

export const retryExecFactory = async (func, retries = 3):Promise<any> => {
  return promiseRetry((retry, number) => {
    return func()
      .catch(retry);
  }, { retries });
};

const CHAIN_GAS_STATION_V1 = {
  1: 'https://api.anyblock.tools/ethereum/ethereum/mainnet/gasprice',
  80001: 'https://gasstation-mainnet.matic.network',
  137: 'https://gasstation-mainnet.matic.network/V1',
  77: 'https://cert.arianee.org/gasStation/testnet.json',
  99: 'https://cert.arianee.org/gasStation/mainnet.json'
};
const CHAIN_GAS_STATION_V2 = {
  80001: 'https://gasstation-mainnet.matic.network/V2',
  137: 'https://gasstation-mainnet.matic.network/v2',
  77: 'https://cert.arianee.org/gasStation/V2/testnet.json',
  99: 'https://cert.arianee.org/gasStation/V2/mainnet.json'
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
  const url = CHAIN_GAS_STATION_V1[chainId.toString()];
  if (!url) {
    throw new Error(`this chain is not handle ${chainId}`);
  }
  const b = await retryExecFactory(() => axios.get(url));
  return b.data;
};
