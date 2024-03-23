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

  // Test case for checking the NFT name
  it("Checks the NFT name", async () => {
    const expectedName = "NFT";
    const actualName = await nftContractInstance.name();
    console.log("Expected Name ->", expectedName);
    console.log("Actual Name ->", actualName);
    expect(actualName).to.equal(expectedName);
  });

  // Test case for checking the NFT symbol
  it("Checks the NFT symbol", async () => {
    const expectedSymbol = "NFTzzz";
    const actualSymbol = await nftContractInstance.symbol();
    console.log("Expected Symbol ->", expectedSymbol);
    console.log("Actual Symbol ->", actualSymbol);
    expect(actualSymbol).to.equal(expectedSymbol);
  });

  // Test case for minting a NFT
  it("Should mint a NFT", async () => {
    const tokenURI = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jJrMRxu";
    await nftContractInstance.mintNft(tokenURI);
    const storedURI = await nftContractInstance.tokenURI(0);
    console.log("Minted URI ->", tokenURI);
    console.log("Returned URI in Contract using Idx ->", storedURI);
    expect(storedURI).to.equal(tokenURI);
  });
});

