// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity "0.8.19";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    uint256 private s_tokenCounter;
    mapping(uint => string) private s_tokenIdToUri;

    constructor() ERC721("NFT", "NFT") {
        s_tokenCounter = 0;
    }

    function mintNft(string memory tokenUri) public {
        s_tokenIdToUri[s_tokenCounter] = tokenUri;
    }

    function tokenURI(
        uint tokenId
    ) public view override returns (string memory) {
        return
            "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
    }
}
