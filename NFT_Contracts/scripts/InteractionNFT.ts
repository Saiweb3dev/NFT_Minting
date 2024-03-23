
import hre from "hardhat"

const interactWithContract = async () => {
  const NftContract = await hre.ethers.getContractFactory("NFT");
  const nft = await NftContract.deploy();


  const tokenURI = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jJrMRxu";
  await nft.mintNft(tokenURI);

  const mintedURI = await nft.tokenURI(0);
  console.log(`Minted URI: ${mintedURI}`);
}

interactWithContract()