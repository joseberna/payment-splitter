// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PaymentSplitter {
    address payable public owner;
    address payable public client;
    uint256 public feePercent; // Ej: 20 = 20%

    event PaymentReceived(
        address indexed from,
        uint256 amount,
        uint256 fee,
        uint256 clientAmount
    );

    constructor(address payable _client, uint256 _feePercent) {
        require(_feePercent <= 100, "Fee cannot be more than 100");
        owner = payable(msg.sender); // Intermediario
        client = _client;
        feePercent = _feePercent;
    }

    receive() external payable {
        uint256 fee = (msg.value * feePercent) / 100;
        uint256 clientAmount = msg.value - fee;

        owner.transfer(fee);
        client.transfer(clientAmount);

        emit PaymentReceived(msg.sender, msg.value, fee, clientAmount);
    }
}
