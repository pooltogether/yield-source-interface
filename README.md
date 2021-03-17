# PoolTogether Yield Source Specification

PoolTogether would like to integrate any protocol that serves as a yield source.  The PoolTogether 3.3.0 contracts introduce a Yield Source Prize Pool, that is bound to a contract that implements the Yield Source Interface.  This is a generic interface that allows a Yield Source Prize Pool to use an external contract for yield.  As long as a contract supports the Yield Source Interface, it can be plugged into the Yield Source Prize Pool.  This makes it easy to add new yield sources.

# Yield Source Interface

The Yield Source Interface is defined in the [IYieldSource.sol](./contracts/IYieldSource.sol) file.

Keep in mind:

- All deposits are denominated in the `depositToken()` ERC20.
- The `balanceOfToken(address)` function is similar to the Aave aToken, in that the balance must always increase.

## Implementation Requirements

- Delivered as a Github repository
- Readme documents how to setup and run tests
- Uses Hardhat as development framework.
- Uses hardhat-deploy to deploy contracts
- Tests must have 95% code coverage
- All public members documented using Natspec
- Code adheres to standard Solhint configuration (should be part of test command)
- For an example, see the [PoolTogether Pool Contracts](https://github.com/pooltogether/pooltogether-pool-contracts)
