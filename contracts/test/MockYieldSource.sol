// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0;

import "../IYieldSource.sol";
import "./ERC20Mintable.sol";

/**
 * @dev Extension of {ERC20} that adds a set of accounts with the {MinterRole},
 * which have permission to mint (create) new tokens as they see fit.
 *
 * At construction, the deployer of the contract is the only minter.
 */
contract MockYieldSource is ERC20, IYieldSource {
    ERC20Mintable public token;
    uint256 public ratePerSecond;
    uint256 public lastYieldTimestamp;

    uint8 internal _decimals;

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 decimals_
    ) ERC20("YIELD", "YLD") {
        token = new ERC20Mintable(_name, _symbol, decimals_, msg.sender);
        lastYieldTimestamp = block.timestamp;
        _decimals = decimals_;
    }

    function setRatePerSecond(uint256 _ratePerSecond) external {
        _mintRate();
        lastYieldTimestamp = block.timestamp;
        ratePerSecond = _ratePerSecond;
    }

    function yield(uint256 amount) external {
        token.mint(address(this), amount);
    }

    function _mintRate() internal {
        uint256 deltaTime = block.timestamp - lastYieldTimestamp;
        uint256 rateMultiplier = deltaTime * ratePerSecond;
        uint256 balance = token.balanceOf(address(this));
        uint256 mint = (rateMultiplier * balance) / 1 ether;
        token.mint(address(this), mint);
        lastYieldTimestamp = block.timestamp;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    /// @notice Returns the ERC20 asset token used for deposits.
    /// @return The ERC20 asset token address.
    function depositToken() external view override returns (address) {
        return address(token);
    }

    /// @notice Returns the total balance (in asset tokens).  This includes the deposits and interest.
    /// @return The underlying balance of asset tokens.
    function balanceOfToken(address addr) external override returns (uint256) {
        _mintRate();
        return sharesToTokens(balanceOf(addr));
    }

    /// @notice Supplies tokens to the yield source.  Allows assets to be supplied on other user's behalf using the `to` param.
    /// @param amount The amount of asset tokens to be supplied.  Denominated in `depositToken()` as above.
    /// @param to The user whose balance will receive the tokens
    function supplyTokenTo(uint256 amount, address to) external override {
        _mintRate();
        uint256 shares = tokensToShares(amount);
        token.transferFrom(msg.sender, address(this), amount);
        _mint(to, shares);
    }

    /// @notice Redeems tokens from the yield source.
    /// @param amount The amount of asset tokens to withdraw.  Denominated in `depositToken()` as above.
    /// @return The actual amount of interst bearing tokens that were redeemed.
    function redeemToken(uint256 amount) external override returns (uint256) {
        _mintRate();
        uint256 shares = tokensToShares(amount);
        _burn(msg.sender, shares);
        token.transfer(msg.sender, amount);

        return amount;
    }

    function tokensToShares(uint256 tokens) public view returns (uint256) {
        uint256 tokenBalance = token.balanceOf(address(this));

        if (tokenBalance == 0) {
            return tokens;
        } else {
            return (tokens * totalSupply()) / tokenBalance;
        }
    }

    function sharesToTokens(uint256 shares) public view returns (uint256) {
        uint256 supply = totalSupply();

        if (supply == 0) {
            return shares;
        } else {
            return (shares * token.balanceOf(address(this))) / supply;
        }
    }
}
