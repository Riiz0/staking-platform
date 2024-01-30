import React, { useState } from 'react';
import { ethers } from 'ethers';
import { stakingContractABI } from '../abis/staking_abi';

// Replace this with your contract address
const stakingContractAddress = '';

function Stake() {
   const [stakeAmount, setStakeAmount] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [totalStakedByUser, setTotalStakedByUser] = useState(0);
   const [totalStakedInContract, setTotalStakedInContract] = useState(0);
   const [accumulatedRewards, setAccumulatedRewards] = useState(0);

const connectWallet = async () => {
 // Check if MetaMask is installed
 if (!window.ethereum) {
    alert("MetaMask is not installed. Please install it to use this feature.");
    return;
 }

 // Request account access
 try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
 } catch (error) {
    console.error("User rejected request");
    return;
 }

 // Create an Ethers.js provider from MetaMask
 const provider = new ethers.BrowserProvider(window.ethereum);

 // Get the signer from the provider
 const signer = provider.getSigner();

 // Connect to the staking contract
 const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractABI, signer);

 return stakingContract;
};

const handleStake = async () => {
 setIsLoading(true);
 const stakingContract = await connectWallet();

 // Call the stake function on the contract
 const tx = await stakingContract.stake(ethers.parseUnits(stakeAmount, 18));

 // Wait for the transaction to be mined
 await tx.wait();
 setIsLoading(false);
};

const handleStakeAll = async () => {
 setIsLoading(true);
 const stakingContract = await connectWallet();

 // Call the stakeAll function on the contract
 const tx = await stakingContract.stakeAll();

 // Wait for the transaction to be mined
 await tx.wait();
 setIsLoading(false);
};

const handleUnstakeAll = async () => {
 setIsLoading(true);
 const stakingContract = await connectWallet();

 // Call the unstake function on the contract
 const tx = await stakingContract.unstakeAll();

 // Wait for the transaction to be mined
 await tx.wait();
 setIsLoading(false);
};

const handleClaimAll = async () => {
 setIsLoading(true);
 const stakingContract = await connectWallet();

 // Call the claim function on the contract
 const tx = await stakingContract.claimRewards();

 // Wait for the transaction to be mined
 await tx.wait();
 setIsLoading(false);
};

const handleAccumulatedRewards = async () => {
  setIsLoading(true);
  const stakingContract = await connectWallet();

   // Call the accumulatedRewards function on the contract
  const rewards = await stakingContract.accumulatedRewards();

  setAccumulatedRewards(rewards);
  setIsLoading(false);
 };

 const handleGetTotalStakedByUser = async () => {
  setIsLoading(true);
  const stakingContract = await connectWallet();

  // Call the totalStakedByUser function on the contract
  const total = await stakingContract.totalStakedByUser();
  setTotalStakedByUser(total);
  setIsLoading(false);
 };
 
 const handleGetTotalStakedInContract = async () => {
  setIsLoading(true);
  const stakingContract = await connectWallet();

  // Call the totalStakedInContract function on the contract
  const total = await stakingContract.totalStakedInContract();
  setTotalStakedInContract(total);
  setIsLoading(false);
 };
 
return (
  <div className="main-container">
    <div className="stake-navbar">
      <div className="header">
        <h2 className="header-section-title">Staking Platform</h2>
      </div>
      <button className="connect-wallet-btn" onClick={connectWallet}>
        Connect Wallet
      </button>
    </div>
     <div className="body-container">
       <div className="stake-unstake-section">
         <div className="stake-section">
           <h2 className="section-title">Stake Tokens</h2>
           <input
             type="number"
             value={stakeAmount}
             onChange={(e) => setStakeAmount(e.target.value)}
             placeholder="Enter amount to stake"
             className="stake-input"
           />
           <button onClick={handleStake} className="stake-btn">
             Stake Tokens
           </button>
           <button onClick={handleStakeAll} className="stake-all-btn">
             Stake All Tokens
           </button>
         </div>
 
         <div className="unstake-section">
           <h2 className="section-title">Unstake Tokens</h2>
           <button onClick={handleUnstakeAll} className="unstake-btn">
             Unstake All Tokens
           </button>
         </div>
       </div>
 
       <div className="claim-section">
         <h2 className="section-title">Claim Tokens</h2>
         <button onClick={handleClaimAll} className="claim-btn">
           Claim All Tokens
         </button>
       </div>
        <div>
          <h2>Total Staked By User: {totalStakedByUser}</h2>
          <h2>Total Staked In Contract: {totalStakedInContract}</h2>
          <h2>Accumulated Rewards: {accumulatedRewards}</h2>
        </div>
     </div>
     <footer className="footer">
      <p className="footer-paragraph">Staking Project Created For Your Eyes Only</p>
    </footer>
   </div>
 );
}

export default Stake;
