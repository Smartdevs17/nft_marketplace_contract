# NFTMarketplace

NFTMarketplace is a smart contract built on the Ethereum blockchain that allows users to mint, list, and buy Non-Fungible Tokens (NFTs). This contract leverages the OpenZeppelin library for ERC721 token standards and ownership management.

## Features

- **Minting**: Only the contract owner can mint new NFTs.
- **Listing**: NFT owners can list their NFTs for sale at a specified price.
- **Buying**: Users can buy listed NFTs by paying the specified price.
- **Withdrawing**: The contract owner can withdraw funds from the contract.

## Contract Details

### Events

- `NFTMinted(uint256 tokenId, address creator)`: Emitted when a new NFT is minted.
- `NFTListedForSale(uint256 tokenId, uint256 price)`: Emitted when an NFT is listed for sale.
- `NFTSold(uint256 tokenId, address buyer, uint256 price)`: Emitted when an NFT is sold.

### Functions

- `mintNFT(string memory tokenURI, uint256 price) public onlyOwner returns (uint256)`: Mints a new NFT with the given token URI and price. Only the contract owner can call this function.
- `listNFTForSale(uint256 tokenId, uint256 price) public`: Lists an NFT for sale at the specified price. Only the owner of the NFT can call this function.
- `buyNFT(uint256 tokenId) public payable`: Buys a listed NFT by paying the specified price.
- `withdraw() public onlyOwner`: Withdraws funds from the contract. Only the contract owner can call this function.
- `totalMintedNFTs() public view returns (uint256)`: Returns the total number of NFTs minted.
- `getListing(uint256 tokenId) public view returns (NFT memory)`: Returns the details of a listed NFT.

## Usage

### Deployment

To deploy the contract, use the following script:
