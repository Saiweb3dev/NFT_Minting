// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error Random_IpfsNFT__RangeOutOfBounds;

contract Random_IpfsNFT is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

   //Type Declaration
   enum Breed{
    PUG,
    SHIBA_INU,
    ST_BERNARD
   }
 
   //VRF Helpers
   mapping(uint => address) public s_requestIdToSender;
   
   //NFT Variable]
   uint public s_tokenCounter;
   uint internal constant MAX_CHANCE = 100;

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Random_IPFS_NFT", "R_I_NFT") {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;
    }

    function requestNft() public returns (uint requestId) {
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        s_requestIdToSender[requestId] = msg.sender;
    }

    function fulfillRandomWords(
        uint requestId,
        uint[] memory randomeWords
    ) internal override {
      address NftOwner = s_requestIdToSender[requestId];
      uint newTokenId = s_tokenCounter;
        
        uint modRng = randomeWords[0] % MAX_CHANCE;
        Breed dogBreed = getBreedFromModdedRng(modRng); 
        _safeMint(NftOwner,newTokenId);  
    }

    function getBreedFromModdedRng(uint modRng) public pure returns(Breed){
      uint cumulativeSum = 0;
      uint[3] memory chanceArray = getChanceArray();
      for(uint i=0;i<chanceArray.length;i++){
        if(modRng >= cumulativeSum && modRng < cumulativeSum + chanceArray[i]){
          return Breed(i);
        }
        cumulativeSum += chanceArray[i];
      }
      revert Random_IpfsNFT__RangeOutOfBounds();
    }

    function getChanceArray() public pure returns(uint[3] memory){
      return [10,30,MAX_CHANCE];
    }

    function tokenURI(uint) public view override returns (string memory){}
}
