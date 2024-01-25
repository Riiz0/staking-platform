// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract StakedToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    constructor() ERC20("StakedToken", "SKTK") {}

    // mint function
    function mint(address to, uint256 amount) public onlyOwner nonReentrant {
        uint256 adjustedAmount = amount.mul(10**decimals());
        _mint(to, adjustedAmount);
    }

    // burn function
    function burn(uint256 amount) public override{
        uint256 adjustedAmount = amount.mul(10**decimals());
        _burn(msg.sender, adjustedAmount);
    }

    // transfer function
    function transfer(address to, uint256 amount) public override returns (bool) {
        uint256 adjustedAmount = amount.mul(10**decimals());
        return super.transfer(to, adjustedAmount);
    }

    // transferFrom function
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        uint256 adjustedAmount = amount.mul(10**decimals());
        return super.transferFrom(from, to, adjustedAmount);
    }
}
