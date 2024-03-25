import { expect } from "chai";
import { ethers } from "hardhat";

describe("BasicNFT Contract", function () {
 let BasicNFT: any;
 let basicNft: any;
 let owner: any;
 let addr1: any;
 let addr2: any;
 let addrs: any;

 beforeEach(async function () {
    BasicNFT = await ethers.getContractFactory("BasicNFT");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    basicNft = await BasicNFT.deploy();
 });

 describe("Minting", function () {
    it("Should mint a new NFT", async function () {
      await basicNft.mintNft();
      const tokenURI = await basicNft.tokenURI(0);
      expect(tokenURI).to.equal("ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json");
    });

    it("Should increase the token counter after minting", async function () {
      const initialCounter = await basicNft.getTokenCounter();
      await basicNft.mintNft();
      const newCounter = await basicNft.getTokenCounter();
      console.log("New Counter:", Number(newCounter));
      console.log("Initial Counter plus mint value :", Number(initialCounter) + 1);
      // Convert BigInt to number for comparison
      expect(Number(newCounter)).to.equal(Number(initialCounter) + 1);
     });
     
 });

});
