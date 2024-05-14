// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PollContract {
    struct Poll {
        string id;
        string name;
        uint[] choices; // Array to hold votes for choices
        mapping(address => bool) voters; // Track if an address has voted
    }

    mapping(string => Poll) private polls;
    event VoteCasted(string indexed pollId, uint choice, uint votes);

    // Function to create a new poll
    function createPoll(string calldata name, uint numChoices, string calldata pollId) public returns (string memory) {
        Poll storage p = polls[pollId];
        p.id = pollId;
        p.name = name;

        // Initialize choices array with zeros
        p.choices = new uint[](numChoices);
        return pollId;
    }

    // Function to vote on a poll
    function vote(string calldata pollId, uint choice) public {
        Poll storage p = polls[pollId];
        require(choice < p.choices.length, "Invalid choice");
        require(!p.voters[msg.sender], "You have already voted!");
        p.voters[msg.sender] = true;
        p.choices[choice]++;
        emit VoteCasted(pollId, choice, p.choices[choice]);
    }

    // Function to get the total votes for each choice in a poll
    function getVotes(string calldata pollId) public view returns (uint[] memory) {
        Poll storage p = polls[pollId];
        return p.choices;
    }
}
