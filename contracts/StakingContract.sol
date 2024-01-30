// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./StakedToken.sol";

contract StakingContract is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    mapping(address => uint256) public stakedTokens;
    mapping(address => uint256) public lastUnstakeTime;
    mapping(address => uint256) public accumulatedRewards;
    mapping(address => uint256) public stakeStartTime;
    IERC20 public stakedToken;
    uint256 public unstakingFeePercentage = 8.5;
    uint256 public unstakingGracePeriod = 1 hours;
    uint256 public rewardRate = 0.005;
    uint256 public totalStakedTokens;

    constructor(
        address _stakedTokenAddress,
        uint256 _totalStakedTokens
    ){
        stakedToken = IERC20(_stakedTokenAddress);
        totalStakedTokens = _totalStakedtokens;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        stakedTokens[msg.sender] = stakedTokens[msg.sender].add(amount);
        totalStakedTokens = totalStakedTokens.add(amount);
        if (lastUnstakeTime[msg.sender] == 0) {
            lastUnstakeTime[msg.sender] = block.timestamp;
        }
        stakeStartTime[msg.sender] = block.timestamp;
        StakedToken.safeTransferFrom(msg.sender, address(this), amount);
    }

    function stakeAll() external {
        require(stakedToken.balanceOf(msg.sender) > 0, "No tokens to stake");
        uint256 balance = stakedToken.balanceOf(msg.sender);
        stake(balance);
    }

    function unstakeAll() external {
        require(stakedTokens[msg.sender] > 0, "No tokens to unstake");
        require(block.timestamp >= lastUnstakeTime[msg.sender] + unstakingGracePeriod, "Cooldown period has not ended yet");
        uint256 amount = stakedTokens[msg.sender];
        uint256 fee = amount.mul(unstakingFeePercentage).div(100);
        uint256 netAmount = amount.sub(fee);
        stakedTokens[msg.sender] = 0;
        totalStakedTokens = totalStakedTokens.sub(amount);
        uint256 reward = netAmount.mul(block.timestamp.sub(stakeStartTime[msg.sender]) / 86400).div(rewardRate);
        accumulatedRewards[msg.sender] += reward;
        StakedToken.transfer(msg.sender, netAmount);
        StakedToken.transfer(owner(), fee);
        lastUnstakeTime[msg.sender] = block.timestamp;
    }

    function claimRewards() external {
        require(accumulatedRewards[msg.sender] > 0, "Accumulated Rewards must be greater than 0");
        uint256 reward = accumulatedRewards[msg.sender];
        accumulatedRewards[msg.sender] = 0;
        StakedToken.transfer(msg.sender, reward);
    }

    function unstakingFeePercentage() external view returns (uint256) {
        return unstakingFeePercentage;
    }

    function unstakingGracePeriod() external view returns (uint256) {
        uint256 timePassed = block.timestamp - lastUnstakeTime[msg.sender];
        if (timePassed >= unstakingGracePeriod) {
            return 0;
        } else {
            return unstakingGracePeriod - timePassed;
        }
    }

    function rewardRate() external view returns (uint256) {
        return rewardRate;
    }

    function totalStakedInContract() external view returns (uint256){
        return totalStakedTokens;
    }

    function totalStakedByUser() external view returns (uint256){
        return stakedTokens[msg.sender];
    }

    function accumulatedRewards() external view returns (uint256){
        return accumulatedRewards[msg.sender].mul(rewardRate);
    }
}
