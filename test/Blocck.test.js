const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Blocck", function () {
  let token;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const Blocck = await ethers.getContractFactory("Blocck");

    token = await upgrades.deployProxy(
      Blocck,
      [
        owner.address,
        1000000, // 1M tokens
      ],
      {
        initializer: "initialize",
        kind: "uups",
      }
    );

    // Wait for deployment
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should set the correct token name and symbol", async function () {
      expect(await token.name()).to.equal("Blocck");
      expect(await token.symbol()).to.equal("BLOCCK");
    });

    it("Should mint initial tokens to deployer", async function () {
      const expectedBalance = ethers.parseEther("1000000");
      expect(await token.balanceOf(owner.address)).to.equal(expectedBalance);
    });

    it("Should set correct max supply", async function () {
      const maxSupply = ethers.parseEther("1000000"); // 1M tokens (updated to match contract)
      expect(await token.MAX_SUPPLY()).to.equal(maxSupply);
    });

    it("Should be at max supply after initial mint", async function () {
      const maxSupply = await token.MAX_SUPPLY();
      const totalSupply = await token.totalSupply();
      expect(totalSupply).to.equal(maxSupply);
    });
  });

  describe("Minting", function () {
    it("Should not allow minting when at max supply", async function () {
      const mintAmount = ethers.parseEther("1000");

      await expect(token.mint(user1.address, mintAmount)).to.be.revertedWith(
        "Exceeds max supply"
      );
    });

    it("Should not allow non-owner to mint", async function () {
      const mintAmount = ethers.parseEther("1000");

      await expect(token.connect(user1).mint(user2.address, mintAmount)).to.be
        .reverted; // OpenZeppelin v5 uses custom errors, not string messages
    });

    it("Should not allow minting to zero address", async function () {
      const mintAmount = ethers.parseEther("1000");

      await expect(
        token.mint(ethers.ZeroAddress, mintAmount)
      ).to.be.revertedWith("Cannot mint to zero address");
    });

    it("Should not allow minting zero amount", async function () {
      await expect(token.mint(user1.address, 0)).to.be.revertedWith(
        "Amount must be greater than 0"
      );
    });
  });

  describe("Remaining Supply", function () {
    it("Should return zero remaining mintable supply when at max", async function () {
      const remainingSupply = await token.remainingMintableSupply();
      expect(remainingSupply).to.equal(0n);
    });
  });

  describe("ERC20 Functionality", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseEther("100");
      await token.transfer(user1.address, transferAmount);

      expect(await token.balanceOf(user1.address)).to.equal(transferAmount);
      expect(await token.balanceOf(owner.address)).to.equal(
        ethers.parseEther("999900")
      );
    });

    it("Should approve and transferFrom", async function () {
      const approveAmount = ethers.parseEther("100");
      await token.approve(user1.address, approveAmount);

      await token
        .connect(user1)
        .transferFrom(owner.address, user2.address, approveAmount);

      expect(await token.balanceOf(user2.address)).to.equal(approveAmount);
    });
  });

  describe("Upgradeability", function () {
    it("Should be upgradeable", async function () {
      const implementationAddress =
        await upgrades.erc1967.getImplementationAddress(
          await token.getAddress()
        );
      expect(implementationAddress).to.not.equal(ethers.ZeroAddress);
    });

    it("Should not allow non-owner to upgrade", async function () {
      const BlocckV2 = await ethers.getContractFactory("Blocck");

      await expect(
        upgrades.upgradeProxy(await token.getAddress(), BlocckV2.connect(user1))
      ).to.be.reverted;
    });
  });
});
