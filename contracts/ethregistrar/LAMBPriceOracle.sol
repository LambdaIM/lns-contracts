// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract LAMBPriceOracle is Ownable {
    int256 value;
    // Maximum volatility
    int256 constant deviation = 5;

    event PriceUpdated(int256);

    modifier valid(int256 _value) {
        require(0 < _value, "Invalid LAMB price");
        _;
    }

    constructor(int256 _value) {
        set(_value);
    }

    function calibrate(int256 _value) internal view returns (int256) {
        if (0 == value) {
            return _value;
        }

        int256 margin = (value * deviation) / 100;
        int256 diff = _value - value;

        if (margin < abs(diff)) {
            return 0 < diff ? value + margin : value - margin;
        }
        return _value;
    }

    function abs(int256 v) internal pure returns (int256) {
        return 0 < v ? v : -v;
    }

    function set(int256 _value) public onlyOwner valid(_value) {
        value = calibrate(_value);
        emit PriceUpdated(value);
    }

    function latestAnswer() public view returns (int256) {
        return value;
    }
}
