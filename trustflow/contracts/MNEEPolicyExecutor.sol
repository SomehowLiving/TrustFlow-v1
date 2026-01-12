// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract MNEEPolicyExecutor {
    IERC20 public immutable mnee;
    address public owner;

    event PolicySet(
        address indexed agent,
        uint256 maxPerTx,
        uint256 dailyCap,
        uint256 weeklyCap,
        uint64 validFrom,
        uint64 validUntil
    );

    event PaymentExecuted(
        address indexed agent,
        address indexed recipient,
        uint256 amount,
        uint256 spentToday,
        uint256 spentThisWeek
    );

    struct Policy {
        uint256 maxPerTx;
        uint256 dailyCap;
        uint256 weeklyCap;
        uint64 validFrom;
        uint64 validUntil;
    }

    struct SpendState {
        uint256 spentToday;
        uint256 spentThisWeek;
        uint64 lastDay;
        uint64 lastWeek;
    }

    mapping(address => Policy) public policies;
    mapping(address => SpendState) internal spend;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _mnee) {
        owner = msg.sender;
        mnee = IERC20(_mnee);
    }

    function setPolicy(
        address agent,
        uint256 maxPerTx,
        uint256 dailyCap,
        uint256 weeklyCap,
        uint64 validFrom,
        uint64 validUntil
    ) external onlyOwner {
        require(validUntil > validFrom, "Invalid window");
        policies[agent] = Policy(
            maxPerTx,
            dailyCap,
            weeklyCap,
            validFrom,
            validUntil
        );
        emit PolicySet(
            agent,
            maxPerTx,
            dailyCap,
            weeklyCap,
            validFrom,
            validUntil
        );
    }

    function executePayment(address recipient, uint256 amount) external {
        Policy memory p = policies[msg.sender];
        require(p.validFrom != 0, "No policy");
        require(block.timestamp >= p.validFrom, "Not active");
        require(block.timestamp <= p.validUntil, "Expired");
        require(amount <= p.maxPerTx, "Exceeds per-tx limit");

        SpendState storage s = spend[msg.sender];

        uint64 day = uint64(block.timestamp / 1 days);
        uint64 week = uint64(block.timestamp / 1 weeks);

        if (s.lastDay != day) {
            s.spentToday = 0;
            s.lastDay = day;
        }

        if (s.lastWeek != week) {
            s.spentThisWeek = 0;
            s.lastWeek = week;
        }

        require(s.spentToday + amount <= p.dailyCap, "Daily cap exceeded");
        require(s.spentThisWeek + amount <= p.weeklyCap, "Weekly cap exceeded");

        s.spentToday += amount;
        s.spentThisWeek += amount;

        require(mnee.transfer(recipient, amount), "Transfer failed");

        emit PaymentExecuted(
            msg.sender,
            recipient,
            amount,
            s.spentToday,
            s.spentThisWeek
        );
    }

    function getSpendState(
        address agent
    )
        external
        view
        returns (
            uint256 spentToday,
            uint256 spentThisWeek,
            uint64 lastDay,
            uint64 lastWeek
        )
    {
        SpendState memory s = spend[agent];
        return (s.spentToday, s.spentThisWeek, s.lastDay, s.lastWeek);
    }
}