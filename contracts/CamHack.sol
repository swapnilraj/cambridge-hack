// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Non transferable CamHack ERC20 token
contract CamHack is ERC20 {
    address immutable swapnil;

    constructor(uint256 initialSupply) ERC20("CamHack", "CM_HCK") {
        swapnil = msg.sender;
        _mint(msg.sender, initialSupply);
    }

    function transfer(address, uint256) override pure public returns (bool) {
      return false;
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        address owner = _msgSender();
        require(owner == swapnil, "Only token owner can approve");
        _approve(owner, spender, amount);
        return true;
    }
}
