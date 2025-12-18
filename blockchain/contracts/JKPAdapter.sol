// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./IJoKenPo.sol";
import "./JKPLibrary.sol";

contract JKPAdapter {

    IJoKenPo private joKenPo;
    address public immutable owner;

    constructor() {
        owner = msg.sender;
    }

    function getImplementationAddress() external view returns(address){
        return address(joKenPo);
    }

    function getResult() external view upgraded returns (string memory){
        return joKenPo.getResult();
    }

    function getBid() external view upgraded returns (uint256){
        return joKenPo.getBid();
    }

    function getCommission() external view upgraded returns (uint8){
        return joKenPo.getCommission();
    }

    function setBit(uint256 newBid) external upgraded restricted {
        return joKenPo.setBit(newBid);
    }

    function setCommission(uint8 newCommission) external upgraded restricted {
        return joKenPo.setCommission(newCommission);
    }

    function getBalance() external view upgraded returns (uint){
        return joKenPo.getBalance();
    }

    function play(JKPLibrary.Options newChoice) external payable upgraded {
        joKenPo.play{value: msg.value}(newChoice);
    }

    function getLeaderboard() external view upgraded returns(JKPLibrary.Player[] memory) {
        return joKenPo.getLeaderboard();
    }
    
    function upgrade(address newImplementation) external restricted {
        require(newImplementation != address(0), "Empty address is not permitted");
        joKenPo = IJoKenPo(newImplementation);
    }

    modifier restricted() {
        require(owner == msg.sender, "You do not have permission");
        _;
    }

    modifier upgraded() {
        require(address(joKenPo) != address(0), "You must upgrade first");
        _;
    }
}