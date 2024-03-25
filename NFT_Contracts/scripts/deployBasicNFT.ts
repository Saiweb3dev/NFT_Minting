import { ethers } from "hardhat"
const deployBasicNFT = async () => {
  const BasicNFT = await ethers.getContractFactory("BasicNFT")
  const basicNft = await BasicNFT.deploy()
  console.log(`Basic NFT Contract deployed at ${basicNft.target}`)
}
deployBasicNFT()