require("dotenv").config();
const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log(
    "Account balance:",
    ethers.formatEther(await deployer.provider.getBalance(deployer.address))
  );

  const wallet = deployer;

  // Deploy the upgradeable ERC20 token
  const Blocck = await ethers.getContractFactory("Blocck");

  // Deploy proxy and implementation
  const blocck = await upgrades.deployProxy(
    Blocck,
    [
      wallet.address, // initial owner
      1000000, // initial mint amount (1M tokens)
    ],
    {
      initializer: "initialize",
      kind: "uups",
    }
  );

  await blocck.waitForDeployment();

  console.log("Blocck deployed to:", await blocck.getAddress());
  console.log("Token name:", await blocck.name());
  console.log("Token symbol:", await blocck.symbol());
  console.log("Total supply:", ethers.formatEther(await blocck.totalSupply()));
  console.log("Max supply:", ethers.formatEther(await blocck.MAX_SUPPLY()));

  // Verify the deployment
  console.log("\nDeployment verification:");
  console.log(
    "- Contract is upgradeable:",
    await upgrades.erc1967.getImplementationAddress(await blocck.getAddress())
  );
  console.log(
    "- Wallet balance:",
    ethers.formatEther(await blocck.balanceOf(wallet.address))
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
