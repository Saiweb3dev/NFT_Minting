import { expect } from "chai";
import { ethers } from "hardhat";

// Test suite for the NFT Contract
describe("NFT Contract", () => {
  // Reference to the deployed NFT contract
  let nftContractInstance: any;

  // Setup function to deploy the NFT contract before each test
  beforeEach(async () => {
    // Get the NFT contract factory
    const NFT = await ethers.getContractFactory("NFT");
    // Deploy the NFT contract
    nftContractInstance = await NFT.deploy();
    // Print the contract address
    console.log("Contract Address ->", nftContractInstance.address);
  });

   it("Checking the NFT Name ",async () => {
     const expectedName = "NFT";
     const actualName = await nftContractInstance.name();
     console.log("ExpectedName ->", expectedName);
     console.log("ActualName ->", actualName);
     expect(actualName).to.equal(expectedName);
   })

   it("Checking the NFT symbol",async () => {
     const expectedSymbol = "NFTzzz";
     const actualSymbol = await nftContractInstance.symbol();
     console.log("ExpectedSymbol ->", expectedSymbol);
     console.log("ActualSymbol ->", actualSymbol);
     expect(actualSymbol).to.equal(expectedSymbol);
   })

  // Test case for minting a NFT
  it("Should mint a NFT", async () => {
    // URI of the NFT
    const tokenURI = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jJrMRxu";

    // Mint the NFT
    await nftContractInstance.mintNft(tokenURI);
    // Get the URI stored in the contract using the token ID
    const storedURI = await nftContractInstance.tokenURI(0);
    // Print the minted URI and the returned URI in the contract
    console.log("Minted URI ->", tokenURI);
    console.log("Returned URI in Contract using Idx ->", storedURI);
    // Expect the returned URI to be equal to the minted URI
    expect(storedURI).to.equal(tokenURI);
  });
});
