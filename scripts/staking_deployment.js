import { ethers } from "hardhat";

async function main() {
  // Get the StakedToken contract factory
  const StakingFactory = await ethers.getContractFactory("StakingToken");

  // Deploy the StakedToken contract
  const stakingContract = await StakingFactory.deploy();
  await stakingContract.deployed();

  console.log("StakedToken deployed to:", stakingContract.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  