import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFTMarketplace", function () {
    let nftMarketplace: any;
    let owner: any;
    let addr1: any;
    let addr2: any;
    let addrs: any;

    beforeEach(async function () {
        const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        nftMarketplace = await NFTMarketplace.deploy();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await nftMarketplace.owner()).to.equal(owner.address);
        });
    });

    describe("Minting", function () {
        it("Should mint a new NFT", async function () {
            await nftMarketplace.connect(owner).mintNFT("tokenURI", ethers.parseEther("10"));
            const balance = await nftMarketplace.balanceOf(owner.address);
            expect(balance).to.equal(1);
        });
    });

    describe("Listing", function () {
        it("Should list an NFT for sale", async function () {
            await nftMarketplace.connect(owner).mintNFT("tokenURI", ethers.parseEther("10"));
            await nftMarketplace.connect(owner).listNFTForSale(1, ethers.parseEther("1"));
            const listing = await nftMarketplace.getListing(1);
            expect(listing.price).to.equal(ethers.parseEther("1"));
        });
    });

    describe("Buying", function () {
        it("Should allow someone to buy an NFT", async function () {
            await nftMarketplace.connect(owner).mintNFT("tokenURI", ethers.parseEther("10"));
            await nftMarketplace.connect(owner).listNFTForSale(1, ethers.parseEther("1"));
            await nftMarketplace.connect(addr1).buyNFT(1, { value: ethers.parseEther("1") });
            const newOwner = await nftMarketplace.ownerOf(1);
            expect(newOwner).to.equal(addr1.address);
        });
    });

    describe("Withdrawing", function () {
        it("Should allow the owner to withdraw funds", async function () {
            await nftMarketplace.connect(owner).mintNFT("tokenURI", ethers.parseEther("10"));
            await nftMarketplace.connect(owner).listNFTForSale(1, ethers.parseEther("1"));
            await nftMarketplace.connect(addr1).buyNFT(1, { value: ethers.parseEther("1") });
        
            const initialBalance = await ethers.provider.getBalance(owner.address);
        
            // Create a transaction object for withdraw
            const withdrawTx = await nftMarketplace.connect(owner).withdraw();
        
            // Get the gas cost for the withdraw transaction
            const receipt = await withdrawTx.wait();
            const gasUsed = receipt.gasUsed;
            const gasPrice = withdrawTx.gasPrice;
            const gasCost = gasUsed * gasPrice;
        
            const finalBalance = await ethers.provider.getBalance(owner.address);
            console.log("initialBalance", initialBalance);
            // Now, ensure the final balance is greater after accounting for the gas cost
            expect(finalBalance).to.equal(initialBalance - BigInt(gasCost));
        });
    });
});
