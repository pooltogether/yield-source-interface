// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.8.0;

interface IReserve {
  function reserveRateMantissa(address pod) external view returns (uint256);
}
