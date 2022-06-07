const { expect } = require('chai');
const { ethers } = require('hardhat');
const { getSigners } = ethers;

describe('MockYieldSource', () => {
    let wallet1;
    let wallet2;
    let wallet3;
    let mockYieldSource;
    let token;

    before(async () => {
        [wallet1, wallet2, wallet3] = await getSigners();
    });

    beforeEach(async () => {
        const mockYieldSourceFactory = await ethers.getContractFactory('MockYieldSource');

        mockYieldSource = await mockYieldSourceFactory.deploy('Token', 'TOK', 18);
        token = await ethers.getContractAt('ERC20Mintable', await mockYieldSource.token());
    });

    describe('setRatePerSecond', () => {
        it('should set the rate', async () => {
            const actualRate = ethers.utils.parseEther('0.01');
            await mockYieldSource.setRatePerSecond(actualRate);
            const rate = await mockYieldSource.ratePerSecond();
            expect(rate.toString()).to.equal(actualRate.toString());
        });

        it('should accrue', async () => {
            const amount = ethers.utils.parseEther('100');
            await token.mint(wallet1.address, amount);
            await token.approve(mockYieldSource.address, amount);

            await mockYieldSource.supplyTokenTo(amount, wallet1.address);
            await mockYieldSource.setRatePerSecond(ethers.utils.parseEther('0.01')); // 1% per second
            await ethers.provider.send('evm_increaseTime', [100]);
            await ethers.provider.send('evm_mine');

            const balance = await mockYieldSource.callStatic.balanceOfToken(wallet1.address);
            expect(balance.toString()).to.equal(amount.mul(2).toString());
        });
    });
});
