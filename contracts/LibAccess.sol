// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract LibAccess {
    address public owner;
    mapping(string => bool) private books; 
    mapping(string => mapping(address => bool)) private access; 
    mapping(string => address) private bookOwners; 

    event BookAdded(string bookHash);
    event AccessGranted(string bookHash, address user);
    event AccessRevoked(string bookHash, address user);

    modifier onlyOwnerBook(string memory bookHash, address bookOwner) {
        require(bookOwners[bookHash] == bookOwner, "Access denied: Only the owner of the book can perform this function.");
        _;
    }

    modifier onlyOwner{
        require(owner == msg.sender, "Only the owner of the contract can do this!");
        _;
    }


    constructor() {
        owner = msg.sender; 
    }

    function addBook(string memory bookHash, address bookOwner) public onlyOwner{
        require(!books[bookHash], "This book has already been added.");
        books[bookHash] = true; 
        bookOwners[bookHash] = bookOwner; 
        access[bookHash][bookOwner] = true;
        emit BookAdded(bookHash); 
    }


    function grantAccess(string memory bookHash, address user, address bookOwner) public onlyOwner onlyOwnerBook(bookHash, bookOwner) {
        require(books[bookHash], "Book not found.");
        access[bookHash][user] = true; 
        emit AccessGranted(bookHash, user); 
    }

    function revokeAccess(string memory bookHash, address user, address bookOwner) public onlyOwner onlyOwnerBook(bookHash, bookOwner) {
        require(books[bookHash], "Book not found.");
        require(bookOwner != user, "You cannot revoke the permission of the book owner.");
        access[bookHash][user] = false; 
        emit AccessRevoked(bookHash, user); 
    }

    function hasAccess(string memory bookHash, address user) public view returns (bool) {
        return access[bookHash][user]; 
    }
}