require('dotenv').config();
import assert from "assert";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";

assert(process.env.PRIVATE_KEY !== undefined, "PRIVATE_KEY not defined");
assert(process.env.POLYGONSCAN_API_KEY !== undefined, "POLYGONSCAN_API_KEY not defined");
assert(process.env.INFURA !== undefined, "INFURA not defined");

const config: HardhatUserConfig = {
  defaultNetwork: "matic",
  networks: {
    hardhat: {
    },
    matic: {
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA}`,
      accounts: [process.env.PRIVATE_KEY],
      // gas: 2100000,
      gasPrice: 85000000000,
      // gasPrice: 8000000000,
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 600
      }
    }
  },
}

export default config;
