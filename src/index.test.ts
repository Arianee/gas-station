import { CHAIN_GAS_STATION_V1, fetchGasStation } from './index';

describe('index', () => {
  describe('real ping', () => {
    Object.keys(CHAIN_GAS_STATION_V1)
      .map(chainId => {
        test(`ping gas station chainId ${chainId}`, async () => {
          const d = await fetchGasStation(chainId);
          expect(d).toBeDefined();
          expect(d.standard).toBeDefined();
          expect(d.fast).toBeDefined();
          expect(d.safeLow).toBeDefined();
        });
      });
  });
});
