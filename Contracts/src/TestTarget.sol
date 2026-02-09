// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title TestTarget
/// @notice Simple target contract for testing MultiSig execution paths.
contract TestTarget {
    address public owner;
    uint256 public value;
    string public message;
    address public lastCaller;

    event ValueSet(uint256 newValue, address indexed caller);
    event MessageSet(string newMessage, address indexed caller);
    event Deposited(address indexed from, uint256 amount, uint256 balance);
    event Withdrawn(address indexed to, uint256 amount);
    event OwnerChanged(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /// @notice Deploys the contract and sets the initial owner.
    /// @param _owner Address that becomes the owner.
    constructor(address _owner) {
        require(_owner != address(0), "Invalid owner");
        owner = _owner;
        emit OwnerChanged(address(0), _owner);
    }

    /// @notice Stores a number and records the caller.
    /// @param newValue New value to store.
    function setValue(uint256 newValue) external {
        value = newValue;
        lastCaller = msg.sender;
        emit ValueSet(newValue, msg.sender);
    }

    /// @notice Stores a text message and records the caller.
    /// @param newMessage Text to store.
    function setMessage(string calldata newMessage) external {
        message = newMessage;
        lastCaller = msg.sender;
        emit MessageSet(newMessage, msg.sender);
    }

    /// @notice Changes the owner address.
    /// @param newOwner New owner address.
    function setOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }

    /// @notice Sends ETH from this contract to a recipient.
    /// @param to Recipient address.
    /// @param amount Amount in wei.
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        require(address(this).balance >= amount, "Insufficient balance");
        to.transfer(amount);
        emit Withdrawn(to, amount);
    }

    /// @notice Returns the ETH balance of this contract.
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Accepts ETH transfers.
    receive() external payable {
        emit Deposited(msg.sender, msg.value, address(this).balance);
    }
}
