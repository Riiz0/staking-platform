import React, { useState, useEffect} from 'react';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

//imports
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { stakingContractABI } from '../abis/staking_abi';
import { TokenContractABI } from '../abis/token_abi';

const tokenContractAddress = "0x762eC64F29ec4029dA4Aca06E36914C0FF6D37Ca";
const stakingContractAddress = "0xFe2Fe62DCee8cb11ab4ba0b7E0204576f2A12E57";

function Home() {
  const [totalStaked, setTotalStaked] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [totalBurned, setTotalBurned] = useState(0);

  const alchemyUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_PROJECT_SEPOLIA}`;
  const provider = new ethers.JsonRpcProvider(alchemyUrl);

  useEffect(() => {
    const fetchData = async () => {
      // Initialize provider and contracts
      const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractABI, provider);
      const tokenContract = new ethers.Contract(tokenContractAddress, TokenContractABI, provider);
  
      // Fetch total staked and total rewards
      const totalStaked = await stakingContract.totalStaked();
      const totalRewards = await stakingContract.totalRewards();
      const totalSupply = await tokenContract.totalSupply();
      const totalBurned = await tokenContract.totalBurned();

      setTotalStaked(ethers.formatEther(totalStaked));
      setTotalRewards(ethers.formatEther(totalRewards));
      setTotalSupply(ethers.formatEther(totalSupply));
      setTotalBurned(ethers.formatEther(totalBurned));
    };

    fetchData();
    const intervalId = setInterval(fetchData,  60000); // Fetch data every minute

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="home">
      {/* Navbar */}
      <Navbar />

    {/* Main Content */}
    <main className="main">
    <div className="body-container">
  <div className="menu-container">
    <div className="pointer"></div>
  </div>

  {/* Transparent container for staking pool information */}
  <div className="transparent">
  <div className="transparent-container">
    <h2 className="header2-text">Marsh Token Staking Stats</h2>
    <p className="space-between"></p>
      <p className="paragraph-text">Total Tokens Staked: {totalStaked} tokens</p>
      <p className="paragraph-text">Total Rewards Claimed: {totalRewards} tokens</p>
      <p className="paragraph-text">Total Tokens Burned: {totalBurned} tokens</p>
      <p className="paragraph-text">Token Supply: {totalSupply} tokens</p>
  </div>
  </div>
</div>
    <div className="box-body"></div>
      <div className="box-container">
      <Link to="/stake" target="_blank" style={{ textDecoration: "none" }}>
        <div className="select-box">
        <div className="box-inner">
            <h2 className="box-text"> Dapp <span className="box-text-transition">-&gt;</span></h2>
            <p className="box-text-paragraph">"Text Will Be Here To Display The Amount Of APY For Each Stake"</p>
        </div>
        </div>
        </Link>

        <Link to="/more" style={{ textDecoration: "none" }}>
        <div className="select-box">
        <div className="box-inner">
            <h2 className="box-text">Learn More<span className="box-text-transition">-&gt;</span></h2>
            <p className="box-text-paragraph">"Text Will Be Here To Display The Confirm Button For Each Stake"</p>
        </div>
        </div>
      </Link>
      </div>
    </main>

    {/* Footer */}
    <Footer />
  </div>
  )
}

export default Home;
