// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenDistributor is Ownable {
    IERC20 public tokenContract;

    mapping(address => bool) public hasReceivedTokens;

    constructor(address _tokenContractAddress) Ownable(msg.sender) {
        tokenContract = IERC20(_tokenContractAddress);
    }

    // Function to transfer tokens from the TokenContract to the TokenDistributor
    function transferTokensFromContract(uint256 amount) external onlyOwner {
        require(
            tokenContract.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
    }

    function distributeTokens(address recipient) public {
        require(
            !hasReceivedTokens[recipient],
            "Address has already received tokens."
        );
        hasReceivedTokens[recipient] = true;

        // Hardcoded amount of 5000 tokens
        uint256 amount = 5000 * (10 ** 18);

        // Transfer tokens from the TokenDistributor to the recipient
        require(
            tokenContract.transfer(recipient, amount),
            "Token transfer failed"
        );
    }
}
