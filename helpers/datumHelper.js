const Datum = require('datum-sdk');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const ID_STORAGE = path.resolve(__dirname, 'datum.id');


/**
 * saveIdentity - Save identity seed to file
 *
 * @param  {type} seed description
 * @return {type}      description
 */
function saveIdentity(seed) {
  fs.writeFileSync(ID_STORAGE, seed);
}
/**
 * createDatumIdentity - Creates Datum Identity
 *
 * @param  {type} password     password used to encrypt identity data
 * @param  {type} accounts = 0 number of accounts to be generated
 * @return {type}              Datum Object
 */
async function createDatumIdentity(password, accounts = 0) {
  const tmpDatObj = new Datum();
  const id = await Datum.createIdentity(password, accounts);
  saveIdentity(id.seed);
  tmpDatObj.initialize({ identity: id.keystore });
  tmpDatObj.identity.storePassword(password);
  return tmpDatObj;
}

function getDat(address) {
  return fetch(`https://faucet.megatron.datum.org/v1/faucet/dat/${address}`, {
    mode: 'cors',
  });
}

async function recoverDatumObj(seed, password) {
  const tmpId = new Datum().Identity();
  await tmpId.recover(seed, password);
  const tmpDatum = new Datum();
  tmpDatum.initialize({
    identity: JSON.stringify(tmpId.keystore),
  });
  tmpDatum.identity.storePassword(password);
  return tmpDatum;
}
/**
 * loadIdentity - load Identity from saved seed, if not found will create new Identity
 * @param {string} password
 * @return {type}  initialized Datum object
 */
async function loadIdentity(password) {
  if (fs.existsSync(ID_STORAGE)) {
    const seed = fs.readFileSync(ID_STORAGE).toString();
    return recoverDatumObj(seed, password);
  }
  return createDatumIdentity(password);
}
module.exports = (function datumHelper() {
  return {
    loadIdentity,
    getDat,
  };
}());
