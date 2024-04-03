
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

//import {VRFConsumerBaseV2} from "@chainlink/contracts@1.0.0/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";


error Raffle__NotEnoughETHEntered();

contract Raffle is VRFConsumerBaseV2 {
    uint256 private i_entranceFee;
    address payable[] private s_players;

    event RaffleEnter(address indexed player);

    constructor(address vrfCoordinatorV2, uint256 entranceFee) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
    }

    function enterRaffle() public payable {
        if(msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        s_players.push(payable(msg.sender));

        emit RaffleEnter(msg.sender);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {

    }

    function getEntranceFee()  public view returns (uint256) {
       return i_entranceFee; 
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}