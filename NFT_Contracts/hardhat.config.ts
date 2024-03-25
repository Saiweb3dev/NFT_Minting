import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy"
const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork : "hardhat",
   networks:{
    hardhat:{
      chainId:31337,
    },
  },
};

export default config;

