// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CoinFlip {

  mapping (address => uint256) public consecutiveWins;
  mapping (address => uint256) claimed;
  uint256 lastHash;
  uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

  address immutable CamHack;
  address immutable owner;

  constructor(address _CamHack) {
    CamHack = _CamHack;
    owner = msg.sender;
  }

  function claim() external {
    address claimer = msg.sender;

    uint256 wins = consecutiveWins[claimer];

    if (wins > 10 && claimed[claimer] == 0) {
      ERC20(CamHack).transferFrom(owner, claimer, 2);
      claimed[claimer] = 1;
    }
  }

  function flip(bool _guess) public returns (bool) {
    uint256 blockValue = uint256(blockhash(block.number - 1));

    if (lastHash == blockValue) {
      revert();
    }

    lastHash = blockValue;
    uint256 coinFlip = blockValue / FACTOR;
    bool side = coinFlip == 1 ? true : false;

    if (side == _guess) {
      consecutiveWins[msg.sender]++;
      return true;
    } else {
      consecutiveWins[msg.sender] = 0;
      return false;
    }
  }
}
