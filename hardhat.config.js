require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {},
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_PROJECT_SEPOLIA}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  }
};
