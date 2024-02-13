const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
  "Deploying contracts with the account:",
  deployer.address
  );

  const StakingContractFactory = await ethers.getContractFactory("StakingContract");

 // Replace these with the actual values
 const steelTokenAddress = "0xBCce7d3A6aBf4DFa205274DB22b171bA8E08C86b";
 const compensationWalletAddress = "0xfe63Ba8189215E5C975e73643b96066B6aD41A45";

 const stakingContract = await StakingContractFactory.deploy(steelTokenAddress, deployer.address, compensationWalletAddress);

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
  