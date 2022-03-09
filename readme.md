import { fetchGasStation } from '@arianee/gas-station';

const d= await fetchGasStation('1');
console.log(d)
// output
{"safeLow":30.6,"standard":36.1,"fast":36.6,"fastest":36.6,"blockTime":2,"blockNumber":25760791}
