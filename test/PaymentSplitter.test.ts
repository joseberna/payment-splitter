import { ethers } from "hardhat";
import { expect } from "chai";

describe("PaymentSplitter", function () {
    it("should split incoming payment between owner and client", async function () {
        const [owner, client, sender] = await ethers.getSigners();

        // Deploy the contract with 20% fee to owner
        const PaymentSplitter = await ethers.getContractFactory("PaymentSplitter");
        const contract = await PaymentSplitter.connect(owner).deploy(client.address, 20);
        await contract.deployed();

        // Capture initial balances
        const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
        const initialClientBalance = await ethers.provider.getBalance(client.address);

        // Send 1 ETH to contract from sender
        const tx = await sender.sendTransaction({
            to: contract.address,
            value: ethers.utils.parseEther("1.0")
        });
        await tx.wait();

        // Expected values
        const fee = ethers.utils.parseEther("0.2");
        const remainder = ethers.utils.parseEther("0.8");

        // Final balances
        const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
        const finalClientBalance = await ethers.provider.getBalance(client.address);

        const ownerReceived = finalOwnerBalance.sub(initialOwnerBalance);
        const clientReceived = finalClientBalance.sub(initialClientBalance);

        expect(ownerReceived).to.equal(fee);
        expect(clientReceived).to.equal(remainder);
    });
});
