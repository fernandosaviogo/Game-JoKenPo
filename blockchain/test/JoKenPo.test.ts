import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("JoKenPo tests", function () {

  enum Options { NONE, ROCK, PAPER, SCISSORS }  // 0, 1, 2, 3

  const DEFAULT_BID = ethers.parseEther("0.01");

  async function deployFixture() {

    const [owner, player1, player2] = await ethers.getSigners();

    const JoKenPo = await ethers.getContractFactory("JoKenPo");
    const joKenPo = await JoKenPo.deploy();

    return { joKenPo, owner, player1, player2 };
  }

  it("Should get leaderboard", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const player1Instance = joKenPo.connect(player1);
      await player1Instance.play(Options.PAPER, {value: DEFAULT_BID})

      const player2Instance = joKenPo.connect(player2);
      await player2Instance.play(Options.ROCK, {value: DEFAULT_BID})

      const leaderboard = await joKenPo.getLeaderboard();
 
      expect(leaderboard[0].wallet).to.equal(player1.address);
      expect(leaderboard[0].wins).to.equal(1);
      expect(leaderboard.length).to.equal(1);
  });

  it("Should set bid", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const newBid = ethers.parseEther("0.02");

      await joKenPo.setBit(newBid);

      const updateBid = await joKenPo.getBid();
       
      expect(updateBid).to.equal(newBid);
  });

  it("Should NOT set bid (permission)", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const newBid = ethers.parseEther("0.02");

      const instance = joKenPo.connect(player1);
       
      await expect(instance.setBit(newBid)).to.be.revertedWith("You do not have permission");
  });

  it("Should NOT set bid (game in progresses)", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const instance = joKenPo.connect(player1);
      await instance.play(Options.PAPER, {value: DEFAULT_BID})

      const newBid = ethers.parseEther("0.02");
      
      await expect(joKenPo.setBit(newBid)).to.be.revertedWith("You cannot change the bid with a game in progress");
  });

  it("Should set commission", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const newCommission = 11n;

      await joKenPo.setCommission(newCommission);

      const updateCommission = await joKenPo.getCommission();
       
      expect(updateCommission).to.equal(newCommission);
  });

  it("Should not set commission (permission)", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const newCommission = 11n;

      const instance = joKenPo.connect(player1);
       
      await expect(instance.setBit(newCommission)).to.be.revertedWith("You do not have permission");
  });

  it("Should not set commission (game in progresses)", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const instance = joKenPo.connect(player1);
      await instance.play(Options.PAPER, {value: DEFAULT_BID})

      const newCommission = 11n;
      
      await expect(joKenPo.setCommission(newCommission)).to.be.revertedWith("You cannot change the commission with a game in progress");
  });

  it("Should play alone", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const player1Instance = joKenPo.connect(player1);
      await player1Instance.play(Options.PAPER, {value: DEFAULT_BID})

      const result = await joKenPo.getResult();
 
      expect(result).to.equal("Player 1 choose his/her option, Waiting player 2.");
  });

  it("Should play along", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const player1Instance = joKenPo.connect(player1);
      await player1Instance.play(Options.PAPER, {value: DEFAULT_BID})

      const player2Instance = joKenPo.connect(player2);
      await player2Instance.play(Options.ROCK, {value: DEFAULT_BID})

      const result = await joKenPo.getResult();
 
      expect(result).to.equal("Paper wraps rock. Player 1 won.");
  });  

  it("Should NOT play alone (owner)", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);
       
      await expect(joKenPo.play(Options.PAPER, {value: DEFAULT_BID})).to.be.revertedWith("The owner cannot play");
  });

  it("Should NOT play alone (wrong option)", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const instance = joKenPo.connect(player1);
      await expect(instance.play(Options.NONE, {value: DEFAULT_BID})).to.be.revertedWith("Invalid choice");
  })

  it("Should NOT play alone (twice in a row)", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const instance = joKenPo.connect(player1);
      await instance.play(Options.PAPER, {value: DEFAULT_BID})

      await expect(instance.play(Options.ROCK, {value: DEFAULT_BID})).to.be.revertedWith("Wait the another player");
  })

  it("Should NOT play alone (wrong bid)", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const instance = joKenPo.connect(player1);

      await expect(instance.play(Options.ROCK, {value: DEFAULT_BID - 1n})).to.be.revertedWith("Invalid bid");
  })
});
