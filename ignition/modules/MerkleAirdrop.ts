import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import merkle from "../../merkle";
const { generateMerkleRoot } = merkle;

async function setupMerkleAirdropModule() {
    // Generate the merkle root asynchronously
    const merkleRoot = await generateMerkleRoot();
  
    return buildModule("MerkleAirdropModule", (m) => {
      const token = m.contract("SmartDevToken");
      const merkleAirdrop = m.contract("MerkleAirdrop", [token, merkleRoot]);
  
      return { token, merkleAirdrop };
    });
  }
  
  export default setupMerkleAirdropModule;