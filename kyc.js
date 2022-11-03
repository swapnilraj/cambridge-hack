require('dotenv').config();
const assert = require('assert');
const prompts = require('prompts');

const { ethers } = require('hardhat');
const {readFileSync, writeFileSync} = require('fs');
// console.log(ethers);

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_KEY = process.env.INFURA;

assert(PRIVATE_KEY !== undefined);
assert(INFURA_KEY !== undefined);

(async () => {
  const name = await prompts({
    type: 'text',
    name: 'name',
    message: 'What is your name?',
    validate: value => value.length !== 0
  });

  const address = await prompts({
    type: 'text',
    name: 'address',
    message: 'What is your address?',
    validate: address => address.length === 42
  })

  const email = await prompts({
    type: 'text',
    name: 'email',
    message: 'What id your email?',
    validate: email => email.includes("@")
  })

  let provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`)
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const VaultFactory = await ethers.getContractFactory("Vault");
  const vault = VaultFactory.attach("0x9c0e24049c73CBe812FFf175e709072231D51301").connect(wallet);
  console.log(`Kycing ${name.name} with address ${address.address}`)

  const kycObject = {...name, ...email, ...address};
  const kycJSON = JSON.parse(readFileSync('kyc.json', 'utf8'));
  kycJSON.push(kycObject);
  writeFileSync('kyc.json', JSON.stringify(kycJSON));

  const tx = await vault.kyc(address.address, name.name, {gasPrice: 95000000000});
  console.log(tx);
  console.log(await tx.wait());
})();
