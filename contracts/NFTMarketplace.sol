// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    uint256 private _currentTokenId = 0;

    struct NFT {
        uint256 tokenId;
        address payable creator;
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => NFT) public nfts;
    mapping(uint256 => address) public nftOwners;

    event NFTMinted(uint256 tokenId, address creator);
    event NFTListedForSale(uint256 tokenId, uint256 price);
    event NFTSold(uint256 tokenId, address buyer, uint256 price);

    constructor() ERC721("NFTMarketplace", "NFTM") Ownable(msg.sender) {}

    function mintNFT(string memory tokenURI, uint256 price) public onlyOwner returns (uint256) {
        _currentTokenId += 1;
        uint256 newTokenId = _currentTokenId;
        
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        nfts[newTokenId] = NFT(newTokenId, payable(msg.sender), price, false);
        nftOwners[newTokenId] = msg.sender;

        emit NFTMinted(newTokenId, msg.sender);
        
        return newTokenId;
    }

    function listNFTForSale(uint256 tokenId, uint256 price) public {
        require(nftOwners[tokenId] == msg.sender, "Only owner can list NFT for sale");
        require(price > 0, "Price must be greater than zero");

        nfts[tokenId].price = price;
        nfts[tokenId].forSale = true;

        emit NFTListedForSale(tokenId, price);
    }

    function buyNFT(uint256 tokenId) public payable {
        require(nfts[tokenId].forSale, "This NFT is not for sale");
        require(msg.value == nfts[tokenId].price, "Incorrect price");

        address seller = nftOwners[tokenId];

        _transfer(seller, msg.sender, tokenId);
        payable(seller).transfer(msg.value);

        nfts[tokenId].forSale = false;
        nftOwners[tokenId] = msg.sender;

        emit NFTSold(tokenId, msg.sender, msg.value);
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function totalMintedNFTs() public view returns (uint256) {
        return _currentTokenId;
    }

    function getListing(uint256 tokenId) public view returns (NFT memory) {
        return nfts[tokenId];
    }

    function getNFT(uint256 tokenId) public view returns (NFT memory) {
        return nfts[tokenId];
    }

    function getNFTOwner(uint256 tokenId) public view returns (address) {
        return nftOwners[tokenId];
    }

    function getNFTPrice(uint256 tokenId) public view returns (uint256) {
        return nfts[tokenId].price;
    }

    function getNFTForSale(uint256 tokenId) public view returns (bool) {
        return nfts[tokenId].forSale;
    }
}
