// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title Blocck
 * @dev An upgradeable ERC20 token with minting capabilities and supply cap
 */
contract Blocck is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    // Maximum supply of tokens (1 million tokens)
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10 ** 18;

    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event MaxSupplyUpdated(uint256 oldMaxSupply, uint256 newMaxSupply);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the contract with initial owner and mint amount
     * @param initialOwner The address that will be the owner
     * @param mintAmount The initial amount of tokens to mint (in whole tokens)
     */
    function initialize(
        address initialOwner,
        uint256 mintAmount
    ) public initializer {
        require(initialOwner != address(0), "Invalid owner address");
        require(mintAmount > 0, "Mint amount must be greater than 0");

        __ERC20_init("Blocck", "BLOCCK");
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();

        uint256 initialTokens = mintAmount * 10 ** decimals();
        require(initialTokens <= MAX_SUPPLY, "Initial mint exceeds max supply");

        _mint(msg.sender, initialTokens);
        emit TokensMinted(msg.sender, initialTokens);
    }

    /**
     * @dev Mints new tokens to the specified address
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");

        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Returns the remaining tokens that can be minted
     */
    function remainingMintableSupply() public view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }

    /**
     * @dev Authorizes contract upgrades (only owner can upgrade)
     * @param newImplementation The address of the new implementation
     */
    function _authorizeUpgrade(
        address newImplementation
    ) internal view override onlyOwner {
        require(
            newImplementation != address(0),
            "Invalid implementation address"
        );
    }
}
