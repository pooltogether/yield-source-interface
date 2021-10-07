require('hardhat-abi-exporter')

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: 'berlin',
        },
      },
      {
        version: '0.8.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: 'berlin',
        },
      },
    ],
  },
  abiExporter: {
    path: './abis',
    clear: true,
    flat: true
  }
};
