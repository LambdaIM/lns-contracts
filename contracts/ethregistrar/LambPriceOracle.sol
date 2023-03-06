// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract LambPriceOracle is Ownable {
    int256 value;

    constructor(int256 _value) {
        set(_value);
    }

    function set(int256 _value) public onlyOwner {
        value = _value;
    }

    function latestAnswer() public view returns (int256) {
        return value;
    }
}
