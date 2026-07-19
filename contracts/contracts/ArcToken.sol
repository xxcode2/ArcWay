// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title ArcToken
/// @notice Minimal, self-contained ERC-20 used by ArcWay's Launchpad to let users deploy
///         their own token on Arc Testnet. No external imports so it compiles standalone
///         with just solc — no OpenZeppelin dependency required.
contract ArcToken {
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    address public owner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);

    modifier onlyOwner() {
        require(msg.sender == owner, "ArcToken: not owner");
        _;
    }

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply, address _owner) {
        name = _name;
        symbol = _symbol;
        owner = _owner;
        _mint(_owner, _initialSupply);
    }

    function transfer(address to, uint256 value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        require(allowed >= value, "ArcToken: insufficient allowance");
        if (allowed != type(uint256).max) {
            allowance[from][msg.sender] = allowed - value;
        }
        _transfer(from, to, value);
        return true;
    }

    /// @notice Owner can mint additional supply — lets the launchpad creator run a
    ///         faucet-style distribution for their own testnet token.
    function mint(address to, uint256 value) external onlyOwner {
        _mint(to, value);
    }

    function _mint(address to, uint256 value) internal {
        totalSupply += value;
        balanceOf[to] += value;
        emit Transfer(address(0), to, value);
        emit Mint(to, value);
    }

    function _transfer(address from, address to, uint256 value) internal {
        require(to != address(0), "ArcToken: transfer to zero address");
        uint256 bal = balanceOf[from];
        require(bal >= value, "ArcToken: insufficient balance");
        unchecked {
            balanceOf[from] = bal - value;
        }
        balanceOf[to] += value;
        emit Transfer(from, to, value);
    }
}
