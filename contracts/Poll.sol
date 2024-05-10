// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PollContract {
    // Structure to hold the details of a poll
    struct Poll {
        uint256 id;
        string name;
        mapping(uint => uint) choices; // Choice number to votes count
        mapping(address => bool) voters; // Track if an address has voted
    }

    // State variable to store polls
    mapping(uint256 => Poll) private polls;

    // Event to emit when a vote is cast
    event VoteCasted(uint256 indexed pollId, uint choice, uint votes);

    // Function to create a new poll
    function createPoll(string memory name, uint numChoices, uint pollId) public returns (uint256) {
        Poll storage p = polls[pollId];
        p.id = pollId;
        p.name = name;

        // Initialize each choice with 0 votes
        for (uint i = 1; i <= numChoices; i++) {
            p.choices[i] = 0;
        }

        return pollId;
    }

    // Function to vote on a poll
    function vote(uint256 pollId, uint choice) public {
        Poll storage p = polls[pollId];
        require(choice != 0, "Choice must be greater than zero");
        require(!p.voters[msg.sender], "You have already voted!");

        // Record that the voter has voted
        p.voters[msg.sender] = true;

        // Increment the vote count for the chosen option
        p.choices[choice]++;

        // Emit an event for the new vote
        emit VoteCasted(pollId, choice, p.choices[choice]);
    }

    // Function to get the total votes for a choice in a poll
    function getVotes(uint256 pollId, uint choice) public view returns (uint) {
        Poll storage p = polls[pollId];
        return p.choices[choice];
    }
}