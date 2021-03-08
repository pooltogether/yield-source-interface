# Aave V2 Yield Source Specification

## Introduction

PoolTogether would like to integrate Aave as a yield source.  The Aave protocol includes money markets for many types of tokens and would be a great addition to the protocol.

The PoolTogether 3.3.0 contracts introduce a Yield Source Interface.  This is a generic interface that allows a Yield Source Prize Pool to generate yield using an external contract.  As long as a contract supports the Yield Source Interface, it can be plugged into the Yield Source Prize Pool.  This interface makes it easy to add new yield sources.

## Scope of Work

The protocol requires an Aave V2 Yield Source implementation in order to interface with the Aave V2 money markets.  To make adding new Aave V2 money markets easier, the protocol also needs an Aave V2 Yield Source factory that allows users to easily build yield sources from money markets.

## Aave V2 Yield Source

An Aave V2 Yield Source is a wrapper for an Aave V2 money market.  It adheres to the PoolTogether 3.3.0 [Yield Source Interface](https://docs.pooltogether.com/protocol/yield-sources/custom-yield-sources).

The **protocol** yield source must implement the [protocol yield source interface](./contracts/IProtocolYieldSource.sol).

Note that there are two privileged roles: the owner and the asset manager.  The owner can do every privileged action and determines who is the asset manager.  The asset manager can only transfer tokens out.  The Yield Source should inherity from the OpenZeppelin [AccessControl](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol) contract.

### Yield Source Stretch Goal

Deposits are batched.

## Aave V2 Yield Source Factory

The protocol will deploy one Aave V2 yield source for each asset listed in the Aave V2 money market using the Aave V2 Yield Source Factory.

The factory only needs one function:

```solidity
create(address aaveMoneyMarket, uint256 reserveRate, address owner)
```

This will create a new Aave V2 Yield Source using the minimal proxy pattern and initialize it.

## Non-Functional Requirements

- Delivered as a private Github repository
- A readme on how to setup and run tests
- Written in Solidity
- Uses Hardhat as development framework.
- Uses hardhat-deploy to deploy contracts
- Tests must have 95% code coverage
- All public members documented using Natspec
- Code adheres to standard Solhint configuration (should be part of test command)
- See the [PoolTogether Pool Contracts](https://github.com/pooltogether/pooltogether-pool-contracts) as an example.
