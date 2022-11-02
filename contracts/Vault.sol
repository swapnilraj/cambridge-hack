// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault {
    address[] public winners;
    uint256 winnersIndex = 0;
    mapping (address => string) public kycNames;
    mapping (address => uint256) public kyced;
    uint256 public remainingToken;

    address immutable owner;
    address immutable USDC;
    address immutable CamHack;
    uint256 immutable public deployedAt;
    uint256 immutable totalSupply;
    uint256 immutable usdcAmount;

    constructor(address _USDC, address _CamHack, uint256 _totalSupplyCamHack, uint256 _usdcAmount) {
      USDC = _USDC;
      CamHack = _CamHack;
      totalSupply = _totalSupplyCamHack;
      owner = msg.sender;
      usdcAmount = _usdcAmount;
      deployedAt = block.timestamp;
    }

    // Call with the address and the name of the person registerting
    function kyc(address newperson, string calldata name) external {
      require(msg.sender == owner, "KYC can only be done by Swapnil");
      kyced[newperson] = 1;
      kycNames[newperson] = name;
    }

    function claim() external returns (uint256) {
      uint256 currentTime = block.timestamp;
      if (currentTime < deployedAt + 129600) {
        revert("Can't claim until 24 hours of deploy time");
      }

      address claimer = msg.sender;

      require(kyced[claimer] == 1, "can't claim if not kyced");

      uint256 camHackBalance = ERC20(CamHack).balanceOf(claimer);

      uint256 circulatingSupply = totalSupply - ERC20(CamHack).balanceOf(owner);
      uint256 usdcFraction = camHackBalance / circulatingSupply;

      winners[winnersIndex++] = claimer;

      uint256 usdcWinnings = usdcFraction * usdcAmount;

      // TODO add try catch
      ERC20(USDC).transfer(claimer, usdcWinnings);
      return usdcFraction;
    }

    function giveMoneyBack() external {
      require(msg.sender == owner, "only swapnil gets the money");
      uint256 myBalance = ERC20(USDC).balanceOf(address(this));
      ERC20(USDC).transfer(msg.sender, myBalance);
    }
}
