import hre from "hardhat";

async function main() {
  const [deployer] = await hre.viem.getWalletClients();
  const token = await hre.viem.deployContract("ArcToken", [
    "ArcWay Demo Token",
    "AWD",
    1_000_000n * 10n ** 18n,
    deployer.account.address,
  ]);
  console.log(`ArcToken deployed at: ${token.address}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
