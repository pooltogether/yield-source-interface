# PoolTogether Protocol Yield Source Specification

PoolTogether would like to integrate any protocol that serves as a yield source.  The PoolTogether 3.3.0 contracts introduce a Yield Source Prize Pool, that is bound to a contract that implements the Yield Source Interface.  This is a generic interface that allows a Yield Source Prize Pool to use an external contract for yield.  As long as a contract supports the Yield Source Interface, it can be plugged into the Yield Source Prize Pool.  This makes it easy to add new yield sources.

## Protocol Yield Source Interface

The PoolTogether protocol would like to create special protocol yield sources that capture reserve for the protocol treasury.  These yield sources will become the foundation on which new prize pools will be built, and prize pools built using protocol yield sources would be much more likely to receive additional benefits such as liquidity mining.

The [protocol yield source interface](./contracts/IProtocolYieldSource.sol) is a superset of the [yield source interface](./contracts/IYieldSource.sol).  It includes new functions to manage the reserve.

Note that there are two privileged roles: the owner and the asset manager.  The owner can do every privileged action and determines who is the asset manager.  The asset manager can only transfer tokens out (see the [protocol yield source interface](./contracts/IProtocolYieldSource.sol) natspec). The Yield Source could inherit from the OpenZeppelin [AccessControl](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol) contract to implement roles.

## Best Practices

- Delivered as a Github repository
- Readme documents how to setup and run tests
- Uses Hardhat as development framework.
- Uses hardhat-deploy to deploy contracts
- Tests must have 95% code coverage
- All public members documented using Natspec
- Code adheres to standard Solhint configuration (should be part of test command)
- For an example, see the [PoolTogether Pool Contracts](https://github.com/pooltogether/pooltogether-pool-contracts)
