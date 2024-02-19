// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./TokenContract.sol";

contract StakingContract is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public tokenContract;
    uint256 public totalStaked;
    uint256 public totalRewards;
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public rewardBalance;
    mapping(address => uint256) public stakingTime;
    mapping(address => uint256) public lastUnstakeTime;

    address public compensationWallet;
    uint256 public rewardRate;
    uint256 public constant GRACE_PERIOD =  15 minutes;

    event Staked(address indexed user, uint256 amount);
    event Unstake(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    constructor(IERC20 _tokenContract, address initialOwner, address _compensationWallet, uint256 _annualPercentageYield) Ownable(initialOwner) {
        tokenContract = _tokenContract;
        compensationWallet = _compensationWallet;
        rewardRate = (_annualPercentageYield *  1e18) / (365 *  24 *  60 *  60);
    }

    function stake(uint256 _amount) external whenNotPaused nonReentrant {
        require(_amount >  0, "Cannot stake  0 tokens");

        // Check if the grace period has passed since the last unstake
        require(block.timestamp >= lastUnstakeTime[msg.sender] + GRACE_PERIOD, "Must wait the grace period before staking again");

        stakingBalance[msg.sender] += _amount;
        totalStaked += _amount;
        stakingTime[msg.sender] = block.timestamp;
        tokenContract.safeTransferFrom(msg.sender, address(this), _amount);
        emit Staked(msg.sender, _amount);
    }

    function unstake() external whenNotPaused nonReentrant {
        uint256 amount = stakingBalance[msg.sender];
        require(amount >  0, "Nothing to unstake");

        // Calculate the reward up to this point
        uint256 reward = calculateReward(msg.sender);
        // Update the reward balance with the accumulated reward
        rewardBalance[msg.sender] += reward;
        totalRewards += reward;

        // Calculate fees and amounts as before, but without affecting the rewards
        uint256 fee = amount *  6 /  100; // Calculate the  6% fee
        uint256 burnAmount = fee /  2; //  3% of the fee to be burned
        uint256 ownerAmount = fee - burnAmount; // The other  3% to be sent to the owner
        uint256 netAmount = amount - fee; // Net amount after subtracting the fee

        // Burn half of the fee
        TokenContract(address(tokenContract)).burnTokens(address(this), burnAmount);

        // Transfer the other half to the owner
        tokenContract.safeTransfer(compensationWallet, ownerAmount);

        // Transfer the net amount back to the user
        tokenContract.safeTransfer(msg.sender, netAmount);

        // Record the current timestamp as the last unstake time
        lastUnstakeTime[msg.sender] = block.timestamp;
        
        // Reduce the staking balance and total staked amount
        stakingBalance[msg.sender] =  0;
        totalStaked -= amount;

        emit Unstake(msg.sender, amount);
    }

    function claimReward() external whenNotPaused nonReentrant {
        uint256 reward = calculateReward(msg.sender);

        // If the calculated reward is zero, check the rewardBalance
        if (reward ==  0) {
            reward = rewardBalance[msg.sender];
            require(reward >  0, "No rewards to claim");
        }

        // Update the reward balance with the calculated or balance reward
        rewardBalance[msg.sender] =  0;
        totalRewards += reward;

        // Transfer the reward to the user
        tokenContract.safeTransfer(msg.sender, reward);

        // Reset the user's staking time to the current block timestamp
        stakingTime[msg.sender] = block.timestamp;

        emit RewardPaid(msg.sender, reward);
    }

    function calculateReward(address _user) public view returns (uint256) {
        uint256 timeStaked = block.timestamp - stakingTime[_user];
        uint256 reward = (stakingBalance[_user] * timeStaked * rewardRate) /  1e18;
        return reward;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
