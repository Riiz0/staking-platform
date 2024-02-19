const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
  "Deploying contracts with the account:",
  deployer.address
  );

  const StakingContractFactory = await ethers.getContractFactory("StakingContract");

 // Replace these with the actual values
 const tokenContract = "0x2B5A89c5Ab102117A5e8c76E06e7a72E51D1c500";
 const compensationWalletAddress = "0xfe63Ba8189215E5C975e73643b96066B6aD41A45";
 const annualPercentageYield =  8; // Annual percentage yield (APY) for the rewards

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
  