import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("JoKenPo tests", function () {

  async function deployFixture() {

    const [owner, otherAccount] = await ethers.getSigners();

    const JoKenPo = await ethers.getContractFactory("JoKenPo");
    const joKenPo = await JoKenPo.deploy();

    return { joKenPo, owner, otherAccount };
  }

  it("Should test", async function () {
      const { joKenPo, owner, otherAccount } = await loadFixture(deployFixture);

      expect(true).to.equal(true);
  });
});
