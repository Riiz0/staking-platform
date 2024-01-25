import { ethers } from "hardhat";

async function main() {
  // Get the StakedToken contract factory
  const StakedTokenFactory = await ethers.getContractFactory("StakedToken");

  // Deploy the StakedToken contract
  const stakedToken = await StakedTokenFactory.deploy();
  await stakedToken.deployed();

  console.log("StakedToken deployed to:", stakedToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  