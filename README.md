# Project Overview

Project Name: MARSH Staking Platform

Language: Solidity (for smart contracts), JavaScript (for frontend)

What it does: A decentralized application (DApp) that allows users to stake tokens, earn rewards.

Why it's useful: Provides a transparent and secure way for users to stake their tokens, earn rewards, and participate in the network.

## Contracts Overview

### `TokenContract`

**Purpose:** Manages the creation, distribution, and burning of Marsh Tokens (MASH).

**Features:**

- Minting: Allows the contract owner to mint new tokens.

- Burning: Enables users to burn their own tokens and also provides a function for the contract owner to burn tokens on behalf of users.

- Transfer to Staking Contract: Facilitates the transfer of tokens to the staking contract for initial rewards.

- ERC20 Compliance: Complies with the ERC20 standard, ensuring compatibility with Ethereum wallets and other ERC20 tokens.

- Burnable: Utilizes the ERC20Burnable extension from OpenZeppelin, allowing tokens to be permanently removed from circulation.

### `StakingContract`

**Purpose:** Enables users to stake tokens and earn rewards based on the staking duration and the project's annual percentage yield (APY).

**Features:**

- Staking: Users can stake their tokens to earn rewards.

- Unstaking: Users can unstake their tokens and receive a portion of their staked tokens back, along with any earned rewards.

- Reward Claiming: Users can claim their earned rewards at any time.

- Grace Period: A grace period is enforced to prevent users from staking immediately after unstaking, encouraging longer-term staking.

- Fee and Burn Mechanism: A 12% fee is applied to unstaked tokens, with 6% burned and 6% sent to a compensation wallet.

- Pausable and Ownable: The contract is pausable by the owner, providing an additional layer of control over the staking process.

### `TokenDistributorContract`

**Purpose:** Automatically distributes tokens to new users upon connection to the DApp.

**Features:**

- Token Distribution: Automatically distributes 5000 tokens to new users upon connection to the DApp.

- Tracking Distribution Status: Uses a mapping to track whether a user has already received tokens.

### `Getting Started`

1. Prerequisites: Ensure you have MetaMask installed and set up.

2. Installation: No installation required for the frontend. For the smart contracts, clone the repository and use Truffle or Hardhat for deployment.

3. Accessing the DApp: Visit the deployed DApp URL to start using the application.

Link: [MARSH Staking Platform](https://staking-platform-seven.vercel.app/).

### `Usage`

- Connecting Wallet: Click on the "Connect Wallet" button to connect your MetaMask wallet to the DApp.

- Staking Tokens: Enter the amount of tokens you wish to stake and select the staking duration. Click "Stake Tokens" to initiate the staking process.

- Claiming Rewards: Once your staking period is over, you can claim your rewards by clicking on the "Claim Rewards" button.

## Limitations

- Token Distribution: Tokens are distributed only once per user. Subsequent connections will not trigger a new distribution.

- Staking Duration: The staking duration will be set to your most recent stake so, if you stake tokens and stake again without claiming the staking duration will be set to the second staking duration and start from that timestamp until you unstake or restake. unClaimed Rewards will be mapped to the users address so, if the user stakes and restakes over and over again the unclaimed rewards will reset because the staking duration reset, but all unclaimed rewards will be saved in a mapping of the users address, so when a user unstakes all they will receive all the unclaimed tokens from the times they kept on restaking without claiming.

### `Contributing`

If you're interested in contributing to the project, please fork the repository, make your changes, and submit a pull request. I welcome all contributions that improve the project.

### `Support`

For any issues or questions, please open an issue on the GitHub repository. I'll be here to help!

### `Acknowledgments`

- Special thanks to the Ethereum and Solidity communities for their support and resources.
