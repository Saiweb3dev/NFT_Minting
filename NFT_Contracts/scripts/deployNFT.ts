import hre from "hardhat"

async function main() {
  console.log("Deploying NFT...");
  const NFT = await hre.ethers.getContractFactory("NFT");
  console.log("Contract factory obtained");
  const nft = await NFT.deploy();
  console.log("Contract deployed successfully");
  console.log("NFT deployed to:", nft.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});