pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault {
    address[] public winners;
    uint256 winnersIndex = 0;
    mapping (address => string) public winnerNames;
    mapping (address => uint256) public winnerClaimed;
    uint256 remainingToken;

    address immutable owner;
    address immutable USDC;
    address immutable CamHack;

    constructor(address _USDC, address _CamHack, uint256 _remainingToken) {
      USDC = _USDC;
      CamHack = _CamHack;
      remainingToken = _remainingToken;
      owner = msg.sender;
    }

    // Call with the moniker that you want to associate with your address
    // to collect your hard earned USDC
    // name will be used for the leaderboard
    function claim(string calldata name) external returns (uint256) {
      address claimer = msg.sender;

      uint256 camHackBalance = ERC20(CamHack).balanceOf(claimer);
      uint256 alreadyClaimed = winnerClaimed[claimer];

      uint256 winnings = camHackBalance - alreadyClaimed;

      if (winnings < remainingToken) {

        string memory winnerName = winnerNames[claimer];

        if (sha256(abi.encodePacked(winnerName)) == sha256("")) {
          winnerNames[claimer] = name;
          winners[winnersIndex++] = claimer;
        }

        winnerClaimed[claimer] += winnings;
        remainingToken -= winnings;

        // TODO add try catch
        ERC20(USDC).transferFrom(owner, claimer, camHackBalance);
        return camHackBalance;
      }

      return 0;
    }

    function topUp(uint256 amount) external {
      require(msg.sender == owner, "Yo what?");
      remainingToken += amount;
    }
}
