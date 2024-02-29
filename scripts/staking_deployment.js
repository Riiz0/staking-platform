const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
  "Deploying contracts with the account:",
  deployer.address
  );

  const StakingContractFactory = await ethers.getContractFactory("StakingContract");

 // Replace these with the actual values
 const tokenContract = process.env.TOKEN_CONTRACT_ADDRESS;
 const compensationWalletAddress = process.env.COMPENSATION_WALLET_ADDRESS;
 const annualPercentageYield =  2; // Annual percentage yield (APY) for the rewards

 const stakingContract = await StakingContractFactory.deploy(
  tokenContract, 
  deployer.address, 
  compensationWalletAddress,
  annualPercentageYield
  );

  await stakingContract.waitForDeployment();

  console.log("StakingContract deployed to:", stakingContract.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
 .then(() => process.exit(0))
 .catch((error) => {
    console.error(error);
    process.exit(1);
 });
  