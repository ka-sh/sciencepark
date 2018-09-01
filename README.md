# Smart City Hackathon

## Datum helper with example

Please use the datumHelper.js to help you get sense of how to generate, recover, and transfer DAT to your accounts.

Please note the following:
1. _All balances are returned in Wei not DAT._
2. _You can't perform concurrent set/remove, this is related to Blockchain not Datum since you have to manage transaction nonce._

### How to get help
1. ask all your questions @ our [gitter_lobby](https://gitter.im/Datum/Lobby)
2. check out our official example folder our [SDK repo](https://github.com/Datum/datum-sdk)
3. [Check our getting Started](https://gettingstarted.datum.org/)

### Create New Datum Object
To Create Datum Identity you need to perform two steps:

1.  Create new datum Object
```javascript
  const tmpDatObj = new Datum();
```
2. Create Identity
```javascript
const id = await Datum.createIdentity("password", accounts);
```
_password is used to encrypt your keystore, accounts is the number of accounts you need to generate. **Usually the value is 0** unless you want to generate number of accounts under the same seed._

3. initialize your datum object with Identity KeyStore
```javascript
tmpDatObj.initialize({ identity: id.keystore });
```
_Note that keystore must be stringified._


#### Full example
```javascript
async function createDatumIdentity(password, accounts = 0) {
  const tmpDatObj = new Datum();
  const id = await Datum.createIdentity(password, accounts);
  //Save Identity is a function that save seed into a file to later recovery
  saveIdentity(id.seed);
  tmpDatObj.initialize({ identity: id.keystore });
  tmpDatObj.identity.storePassword(password);
  return tmpDatObj;
}
```
_storePassword function allow you to perform operations without providing password every time_
### Recover Datum Object From SEED
To recover datum object from seed keyword


1. Create empty Identity object.

```javascript
const tmpId = new Datum().Identity();
```
2. Recover Identity from seed keyword
```javascript
await tmpId.recover(seed, password);
```
_password is used to encrypt the keystore information in datum object_

3. Create empty Datum object
```javascript
const tmpDatum = new Datum();
```

4. initialize datum object with recovered Identity
```javascript
tmpDatum.initialize({
  identity: JSON.stringify(tmpId.keystore),
});
```
_Notice that keystore is stringified_

#### Full example
```javascript
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
```
