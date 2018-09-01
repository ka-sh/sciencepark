const Datum = require('datum-sdk');
const helper = require('./helpers/datumHelper');

console.log('Loading Identity...');
async function fetchBalance(address) {
  console.log('.');
  const balance = await Datum.getBalance(address);
  if (balance === '0') return fetchBalance(address);

  return balance;
}
helper.loadIdentity('password')
  .then(async (datum) => {
    let waitTime = 2000;
    let balance = await Datum.getBalance(datum.identity.address);
    if (balance === '0') {
      console.log('You currently have no DATs in your wallet\nRequest DAT from Faucet ...');
      await helper.getDat(datum.identity.address);
      waitTime = 6000;
    }
    /**
     * The wait part is due to the fact that mining the faucet transaction will take time
     */
    console.log('Fetching wallet balance ....');
    balance = await fetchBalance(datum.identity.address);
    console.log(`Current Balance In Wei : ${balance} Wei`);
  }).catch(err => console.error);
