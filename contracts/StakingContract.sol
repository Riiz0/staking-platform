// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./SteelToken.sol";


contract StakingContract is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public steelToken;
    mapping(address => uint256) private _stakes;
    mapping(address => uint256) private _lastUpdateTime;
    mapping(address => uint256) private _rewards;
    mapping(address => uint256) private _lastUnstakeTime;

    address private compensationWallet;
    uint256 public rewardRate;
    uint256 public constant GRACE_PERIOD =  15 minutes;

    event Staked(address indexed user, uint256 amount);
    event Unstake(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    constructor(IERC20 _steelToken, address initialOwner, address _compensationWallet) Ownable(initialOwner) {
        steelToken = _steelToken;
        compensationWallet = _compensationWallet;
        rewardRate = (8.76 *  10**16) /  365; //  8.76 APY converted to daily rate
    }

    function stake(uint256 amount) external nonReentrant whenNotPaused {
        require(_lastUnstakeTime[msg.sender] + GRACE_PERIOD <= block.timestamp, "Cannot stake within grace period");
        steelToken.safeTransferFrom(msg.sender, address(this), amount);
        _stakes[msg.sender] += amount;
        _lastUpdateTime[msg.sender] = block.timestamp;
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external nonReentrant whenNotPaused {
        _updateReward(msg.sender);
        uint256 fee = amount *  6 /  100; // Calculate the  6% fee
        uint256 burnAmount = fee /  2; //  3% of the fee to be burned
        uint256 ownerAmount = fee - burnAmount; // The other  3% to be sent to the owner
        uint256 netAmount = amount - fee; // Net amount after subtracting the fee

        // Burn half of the fee
        SteelToken(address(steelToken)).burnTokens(address(this), burnAmount);

        // Transfer the other half to the owner
        steelToken.safeTransfer(compensationWallet, ownerAmount);

        // Transfer the net amount back to the user
        steelToken.safeTransfer(msg.sender, netAmount);
        _stakes[msg.sender] -= amount;
        _lastUpdateTime[msg.sender] = block.timestamp;
        _lastUnstakeTime[msg.sender] = block.timestamp;
        emit Unstake(msg.sender, netAmount);
    }

    function claimReward() external nonReentrant whenNotPaused {
        _updateReward(msg.sender);
        uint256 reward = _rewards[msg.sender];
        _rewards[msg.sender] =  0;
        steelToken.safeTransfer(msg.sender, reward);
        emit RewardPaid(msg.sender, reward);
    }

    function _updateReward(address account) private {
        if (_stakes[account] >  0 && _lastUpdateTime[account] !=  0) {
            uint256 timeElapsed = block.timestamp - _lastUpdateTime[account];
            uint256 reward = timeElapsed * rewardRate;
            _rewards[account] += reward;
            _lastUpdateTime[account] = block.timestamp;
        }
    }

    function setCompensationWallet(address newCompensationWallet) external onlyOwner {
        compensationWallet = newCompensationWallet;
    }

    function stakeOf(address account) public view returns (uint256) {
        return _stakes[account];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
