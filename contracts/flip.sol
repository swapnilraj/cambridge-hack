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
  uint256 immutable public deployedAt;

  constructor(address _CamHack) {
    CamHack = _CamHack;
    owner = msg.sender;
    deployedAt = block.timestamp;
  }

  function claim() external {
    uint256 currentTime = block.timestamp;
    if (currentTime > deployedAt + 129600) {
      revert("Can't claim after 36 hours of deploy time");
    }
    address claimer = tx.origin;

    uint256 wins = consecutiveWins[claimer];

    if (wins > 10 && claimed[claimer] == 0) {
      ERC20(CamHack).transferFrom(owner, claimer, 2*10^18);
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
      consecutiveWins[tx.origin]++;
      return true;
    } else {
      consecutiveWins[tx.origin] = 0;
      return false;
    }
  }
}
