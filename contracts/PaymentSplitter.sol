// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PaymentSplitter is Ownable {
    constructor(address _client, uint256 _fee) Ownable(msg.sender) {
        require(_client != address(0), "Client address cannot be zero");
        require(_fee <= 100, "Fee must be between 0 and 100");

        client = _client;
        fee = _fee;
    }

    address public client;
    uint256 public fee;

    event PaymentReceived(address indexed sender, uint256 amount);
    event PaymentDistributed(
        address indexed owner,
        uint256 ownerAmount,
        address indexed client,
        uint256 clientAmount
    );

    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
        _distributePayment(msg.value);
    }

    function _distributePayment(uint256 amount) internal {
        uint256 ownerAmount = (amount * fee) / 100;
        uint256 clientAmount = amount - ownerAmount;

        payable(owner()).transfer(ownerAmount);
        payable(client).transfer(clientAmount);

        emit PaymentDistributed(owner(), ownerAmount, client, clientAmount);
    }

    function updateClient(address _newClient) external onlyOwner {
        require(_newClient != address(0), "Client address cannot be zero");
        client = _newClient;
    }

    function updateFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 100, "Fee must be between 0 and 100");
        fee = _newFee;
    }
}
