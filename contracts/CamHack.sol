pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CamHack is ERC20 {
    address immutable tokenOwner;

    constructor(uint256 initialSupply) ERC20("CamHack", "CM_HCK") {
        tokenOwner = msg.sender;
        _mint(msg.sender, initialSupply);
    }

    function transfer(address, uint256) override pure public returns (bool) {
      return false;
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
     * `transferFrom`. This is semantically equivalent to an infinite approval.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 amount) public override returns (bool) {
        address owner = _msgSender();
        require(owner == tokenOwner, "Only token owner can approve");
        _approve(owner, spender, amount);
        return true;
    }
}
