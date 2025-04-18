import { ethers } from "ethers";
import contractJson from "../abi/PaymentSplitter.json";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");

// Usa las mismas direcciones de Ganache
const senderPrivateKey = "0x..."; // usa la clave privada de la 3ra cuenta de Ganache
const signer = new ethers.Wallet(senderPrivateKey, provider);

const contractAddress = "0x..."; // dirección donde desplegaste el contrato
const contract = new ethers.Contract(contractAddress, contractJson.abi, signer);

export async function sendPayment(amountEth: string) {
  const tx = await signer.sendTransaction({
    to: contract.address,
    value: ethers.utils.parseEther(amountEth),
  });
  await tx.wait();
  return { hash: tx.hash };
}

export async function getStatus() {
  const balance = await provider.getBalance(contract.address);
  return {
    contract: contract.address,
    balance: ethers.utils.formatEther(balance),
    owner: await contract.owner(),
    client: await contract.client(),
  };
}
