const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
  "Deploying contracts with the account:",
  deployer.address
  );

  const TokenDistributorContractFactory = await ethers.getContractFactory("TokenDistributor");

 // Replace these with the actual values
 const tokenContract = process.env.TOKEN_CONTRACT_ADDRESS;

 const tokenDistributorContract = await TokenDistributorContractFactory.deploy(tokenContract);

  await tokenDistributorContract.waitForDeployment();

  console.log("TokenDistributor deployed to:", tokenDistributorContract.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
 .then(() => process.exit(0))
 .catch((error) => {
    console.error(error);
    process.exit(1);
 });
  