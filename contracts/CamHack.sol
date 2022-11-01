pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CamHack is ERC20 {
    constructor(uint256 initialSupply) ERC20("CamHack", "CM_HCK") {
        _mint(msg.sender, initialSupply);
    }
}
