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

  const USDC = ERC20Factory.attach("").connect(wallet)

  const CamHack = await CamHackFactory.deploy(100);
  // TODO: approve the vault to spend USDC
  const vault = await VaultFactory.deploy(USDC.address, CamHack.address, 100);
  await USDC.approve(vault.address, 100);

  // TODO: Approve CoinFlip to spend CamHack tokens
  const coinFlip = await CoinFlipFactory.deploy(CamHack.address);
  await CamHack.approve(coinFlip.address, 100);
}

// TODO: remember to approve(vault.address, 0) after the challenge is over

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
