// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract LAMBPriceOracle is Ownable {
    int256 value;

    event PriceUpdated(int256);

    constructor(int256 _value) {
        set(_value);
    }

    function set(int256 _value) public onlyOwner {
        value = _value;
        emit PriceUpdated(_value);
    }

    function latestAnswer() public view returns (int256) {
        return value;
    }
}
