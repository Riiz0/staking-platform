const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
  "Deploying contracts with the account:",
  deployer.address
  );

  const StakingTokenFactory = await ethers.getContractFactory("SteelToken");

  const initialSupply = ethers.parseEther("420690000000");

  const stakingToken = await StakingTokenFactory.deploy(initialSupply);

  await stakingToken.waitForDeployment();

  console.log("SteelToken deployed to:", stakingToken.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
 .then(() => process.exit(0))
 .catch((error) => {
    console.error(error);
    process.exit(1);
 });
