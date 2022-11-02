require('dotenv').config();

import assert from "assert";
import { ethers } from "hardhat";
async function main() {
  const provider = ethers.getDefaultProvider();
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  assert(PRIVATE_KEY !== undefined);

  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const ERC20Factory = await ethers.getContractFactory("ERC20");
  const CamHackFactory = (await ethers.getContractFactory("CamHack")).connect(wallet);
  const VaultFactory = (await ethers.getContractFactory("Vault")).connect(wallet);
  const CoinFlipFactory = (await ethers.getContractFactory("CoinFlip")).connect(wallet);

  const USDC_POLYGON_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  const USDC = ERC20Factory.attach(USDC_POLYGON_ADDRESS).connect(wallet);

  const TOTAL_SUPPLY_CAM_HACK = 50;
  const TOTAL_USDC = 100;
  const CamHack = await CamHackFactory.deploy(TOTAL_SUPPLY_CAM_HACK);
  // TODO: approve the vault to spend USDC
  const vault = await VaultFactory.deploy(USDC.address, CamHack.address, TOTAL_SUPPLY_CAM_HACK, TOTAL_USDC);
  await USDC.transfer(vault.address, TOTAL_USDC);

  // TODO: Approve CoinFlip to spend CamHack tokens
  const coinFlip = await CoinFlipFactory.deploy(CamHack.address);
  await CamHack.approve(coinFlip.address, (2n ** 256n - 1n));
}

// TODO: remember to vault.giveMoneyBack() after the challenge is over

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
