// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// Importing OpenZeppelin's ERC721URIStorage for NFT functionality
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// Importing Chainlink's VRFCoordinatorV2Interface and VRFConsumerBaseV2 for randomness
import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

// Custom errors for specific conditions
error RandomIpfsNft__AlreadyInitialized();
error RandomIpfsNft__NeedMoreETHSent();
error RandomIpfsNft__RangeOutOfBounds();
error RandomIpfsNft__TransferFailed();

// Main contract that inherits from ERC721URIStorage and VRFConsumerBaseV2
contract RandomIpfsNft is ERC721URIStorage, VRFConsumerBaseV2 {
    // Enum for different breeds of dog
    enum Breed {
        PUG,
        SHIBA_INU,
        ST_BERNARD
    }

    // Variables related to Chainlink VRF
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // Variables related to NFTs
    address private immutable i_owner;
    uint256 private immutable i_mintFee;
    uint256 private s_tokenCounter;
    uint256 internal constant MAX_CHANCE_VALUE = 100;
    string[] internal s_dogTokenUris;
    bool private s_initialized;

    // Mapping to track requestId to sender for VRF callback
    mapping(uint256 => address) public s_requestIdToSender;

    // Events for NFT request and minting
    event NftRequested(uint256 indexed requestId, address indexed requester);
    event NftMinted(uint256 indexed tokenId, Breed indexed breed, address indexed minter);

    // Constructor to initialize contract variables
    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint256 mintFee,
        uint32 callbackGasLimit,
        string[3] memory dogTokenUris
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Random IPFS NFT", "RIN"){
        // Initialize VRF variables
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_mintFee = mintFee;
        i_callbackGasLimit = callbackGasLimit;
        _initializeContract(dogTokenUris);
        s_tokenCounter = 0;
        i_owner = msg.sender;
    }

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == i_owner, "Only the owner can call this function");
        _;
    }

    // Function to request a new NFT
    function requestNft() public payable returns (uint256 requestId) {
        // Check if enough ETH is sent
        if (msg.value < i_mintFee) {
            revert RandomIpfsNft__NeedMoreETHSent();
        }
        // Request random words from Chainlink VRF
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        // Map requestId to sender for callback
        s_requestIdToSender[requestId] = msg.sender;
        emit NftRequested(requestId, msg.sender);
    }

    // Callback function for VRF to mint NFT
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        // Get the owner of the NFT
        address dogOwner = s_requestIdToSender[requestId];
        // Increment token counter and get new item ID
        uint256 newItemId = s_tokenCounter++;
        // Determine breed based on random number
        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;
        Breed dogBreed = getBreedFromModdedRng(moddedRng);
        // Mint the NFT
        _safeMint(dogOwner, newItemId);
        // Set the token URI
        _setTokenURI(newItemId, s_dogTokenUris[uint256(dogBreed)]);
        emit NftMinted(newItemId, dogBreed, dogOwner);
    }

    // Function to get the chance array for breed determination
    function getChanceArray() public pure returns (uint256[3] memory) {
        return [10, 40, MAX_CHANCE_VALUE];
    }

    // Private function to initialize contract with dog token URIs
    function _initializeContract(string[3] memory dogTokenUris) private {
        // Check if contract is already initialized
        if (s_initialized) {
            revert RandomIpfsNft__AlreadyInitialized();
        }
        s_dogTokenUris = dogTokenUris;
        s_initialized = true;
    }

    // Function to determine breed based on random number
    function getBreedFromModdedRng(uint256 moddedRng) public pure returns (Breed) {
        uint256 cumulativeSum = 0;
        uint256[3] memory chanceArray = getChanceArray();
        for (uint256 i = 0; i < chanceArray.length; i++) {
            // Determine breed based on cumulative chance
            if (moddedRng >= cumulativeSum && moddedRng < chanceArray[i]) {
                return Breed(i);
            }
            cumulativeSum = chanceArray[i];
        }
        revert RandomIpfsNft__RangeOutOfBounds();
    }

    // Function to withdraw contract balance to owner
    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert RandomIpfsNft__TransferFailed();
        }
    }

    // Getter functions for contract variables
    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getDogTokenUris(uint256 index) public view returns (string memory) {
        return s_dogTokenUris[index];
    }

    function getInitialized() public view returns (bool) {
        return s_initialized;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
