// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract TokenContract is ERC20, Ownable, ERC20Burnable {

    uint256 public totalBurned;

    constructor(uint256 initialSupply) ERC20("Marsh Token", "MASH") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    // Function to mint new tokens, restricted to the contract owner
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Overridden burn function to allow anyone to burn their own tokens
    function burn(uint256 amount) public override {
        super.burn(amount);

        // Increment the total burned amount
        totalBurned += amount;
    }

    function burnTokens(address from, uint256 amount) external {
        require(from != address(0), "Invalid address");
        _burn(from, amount);

        // Increment the total burned amount
        totalBurned += amount;
    }

    // Function to transfer tokens to the staking contract for initial rewards
    function transferToStakingContract(address stakingContractAddress, uint256 amount) external onlyOwner {
        require(stakingContractAddress != address(0), "Invalid staking contract address");
        _transfer(_msgSender(), stakingContractAddress, amount);
    }
}
