import { ethers } from "hardhat";

async function main() {
  // Direcciones de ejemplo (ajusta con tus cuentas locales de Ganache)
  const [owner, client] = await ethers.getSigners();

  // Parámetros: dirección del cliente, fee %
  const clientAddress = client.address;
  const feePercent = 20;

  const PaymentSplitter = await ethers.getContractFactory("PaymentSplitter");
  const contract = await PaymentSplitter.deploy(clientAddress, feePercent);

  await contract.deployed();

  console.log("✅ PaymentSplitter deployed to:", contract.address);
  console.log("👉 Owner (intermediario):", owner.address);
  console.log("👉 Client (receptor principal):", clientAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
