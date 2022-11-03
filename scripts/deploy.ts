require('dotenv').config();

import assert from "assert";
import { ethers } from "hardhat";
async function main() {
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const INFURA_KEY = process.env.INFURA;

  assert(PRIVATE_KEY !== undefined);
  assert(INFURA_KEY !== undefined);

  let provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`)
  // let provider = ethers.getDefaultProvider('matic');
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const ERC20Factory = await ethers.getContractFactory("ERC20");
  const CamHackFactory = (await ethers.getContractFactory("CamHack")).connect(wallet);
  const VaultFactory = (await ethers.getContractFactory("Vault")).connect(wallet);
  const CoinFlipFactory = (await ethers.getContractFactory("CoinFlip")).connect(wallet);

  const USDC_POLYGON_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  const USDC = ERC20Factory.attach(USDC_POLYGON_ADDRESS).connect(wallet);
  const USDC_DECIMALS = 6n;

  const TOTAL_SUPPLY_CAM_HACK = 50n * (10n ** 18n);
  const TOTAL_USDC = 100n * (10n**USDC_DECIMALS);
  const gasPrice = 85000000000;

  console.log("------------------------DEPLOYING---------------------------");
  console.log("------------------------CAM_HACK---------------------------");
  const CamHack = await CamHackFactory.deploy(TOTAL_SUPPLY_CAM_HACK, { gasPrice });
  console.log({CamHack: CamHack.address});
  // TODO: approve the vault to spend USDC
  console.log("------------------------VAULT---------------------------");
  const vault = await VaultFactory.deploy(USDC.address, CamHack.address, TOTAL_SUPPLY_CAM_HACK, TOTAL_USDC, { gasPrice });
  console.log({vault: vault.address});
  // await USDC.transfer(vault.address, TOTAL_USDC, {gasPrice});

  // TODO: Approve CoinFlip to spend CamHack tokens
  console.log("------------------------CoinFlip---------------------------");
  const coinFlip = await CoinFlipFactory.deploy(CamHack.address, {gasPrice});
  console.log({coinFlip: coinFlip.address});
  await CamHack.approve(coinFlip.address, ((2n ** 256n) - 1n), {gasPrice});
}

// TODO: remember to vault.giveMoneyBack() after the challenge is over

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
