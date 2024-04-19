import hre from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { storeImage } from "../utils/uploadToPinata";
async function main() {
  const chainId : number | undefined = hre.network.config.chainId;
  let VRFCoordinatorV2Address,subscriptionId;
  let tokenUris;
   const imagesLocation = "./Image"

  if(process.env.UPLOAD_TO_PINATA == "true"){
    tokenUris = await handleTokenUris()
  }
  if(chainId == undefined){
    console.error("chainId is undefined. Cannot proceed with deployment.");
  return;
  }
  

  if(developmentChains.includes(hre.network.name)) {
    console.log("Local network detected! Deploying ...");
    const vrfCoordinatorV2Mock = await hre.ethers.getContractFactory("VRFConsumerBaseV2Mock");
    const tx = await vrfCoordinatorV2Mock.getDeployTransaction();
    // Assuming you're deploying on a local network and want to use the default signer
const signer =await  hre.ethers.provider.getSigner();

// Now, use the signer to send the transaction
const txResponse = await signer.sendTransaction(tx);
    const txReceipt = await txResponse.wait(1);
    
if (txReceipt) {
  subscriptionId = txReceipt.events[0].args.subId;
    VRFCoordinatorV2Address = txReceipt.contractAddress;
} else {
    console.error("Transaction receipt is null. Transaction might have failed.");
}
  }
  else{
    VRFCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
    subscriptionId = networkConfig[chainId].subscriptionId
  }

  console.log("----------------------------");
  await storeImage(imagesLocation)
//   const args = [VRFCoordinatorV2Address,subscriptionId,networkConfig[chainId].gasLane,networkConfig[chainId].mintFee,networkConfig[chainId].callbackGasLimit,
 
// ]
  

  console.log("Deploying NFT...");
  const NFT = await hre.ethers.getContractFactory("Random_IpfsNft");
  console.log("Contract factory obtained");
  const nft = await NFT.deploy();
  console.log("Contract deployed successfully");
  console.log("NFT deployed to:", nft.target);
}

const handleTokenUris = async () => {
  tokenUris = []
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

export default main
main.tags = ["all","randomipfs","main"]