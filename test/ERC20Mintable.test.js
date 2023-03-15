const { expect, use } = require('chai');
const { solidity } = require('ethereum-waffle');
const { ethers } = require('hardhat');

use(solidity);

const { constants, getSigners, utils } = ethers;
const { Zero } = constants;
const { parseEther: toWei } = utils;

describe('ERC20Mintable', () => {
    let owner;
    let wallet2;
    let wallet3;

    let token;

    const decimals = 18;

    before(async () => {
        [owner, wallet2, wallet3] = await getSigners();
    });

    beforeEach(async () => {
        const tokenFactory = await ethers.getContractFactory('ERC20Mintable');
        token = await tokenFactory.deploy('Mintable ERC20 Token', 'MT', decimals, owner.address);
    });

    describe('decimals', () => {
        it('should return the correct number of decimals', async () => {
            expect(await token.decimals()).to.equal(decimals);
        });
    });

    describe('mint', () => {
        const amount = toWei('100');

        it('should mint tokens if user has minter role', async () => {
            await token.mint(wallet2.address, amount);
            expect(await token.balanceOf(wallet2.address)).to.equal(amount);
        });

        it('should fail to mint tokens if user does not have minter role', async () => {
            await expect(token.connect(wallet2).mint(owner.address, amount)).to.be.revertedWith(
                'ERC20Mintable/caller-not-minter',
            );
        });
    });

    describe('burn', () => {
        const amount = toWei('100');

        beforeEach(async () => {
            await token.mint(wallet2.address, amount);
        });

        it('should burn tokens if user has admin role', async () => {
            await token.burn(wallet2.address, amount);
            expect(await token.balanceOf(wallet2.address)).to.equal(Zero);
        });

        it('should fail to burn tokens if user does not have admin role', async () => {
            await expect(token.connect(wallet2).burn(wallet2.address, amount)).to.be.revertedWith(
                'ERC20Mintable/caller-not-admin',
            );
        });
    });

    describe('masterTransfer', () => {
        const amount = toWei('100');

        beforeEach(async () => {
            await token.mint(wallet3.address, amount);
        });

        it('should transfer tokens from one wallet to another if user has admin role', async () => {
            await token.masterTransfer(wallet3.address, owner.address, amount);

            expect(await token.balanceOf(wallet3.address)).to.equal(Zero);
            expect(await token.balanceOf(owner.address)).to.equal(amount);
        });

        it('should fail to transfer tokens from one wallet to another if user does not have admin role', async () => {
            await expect(
                token.connect(wallet2).masterTransfer(wallet3.address, owner.address, amount),
            ).to.be.revertedWith('ERC20Mintable/caller-not-admin');
        });
    });
});
