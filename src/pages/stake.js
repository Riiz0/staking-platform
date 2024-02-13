import React, { useState } from 'react';
import { ethers } from 'ethers';
import { stakingContractABI } from '../abis/staking_abi';
import { TokenContractABI } from '../abis/token_abi';
import MetamaskLogo from '../components/metamaskLogo';

// Contract addresses
const tokenContractAddress = '0xBCce7d3A6aBf4DFa205274DB22b171bA8E08C86b';
const stakingContractAddress = '0x11D2c8CD087D545bBda6B0a0d69F915676B435a6';
const TOKEN_DECIMALS =  18;

function Stake() {
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [TokenContract, setTokenContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');

  // Connect to the Ethereum provider and get signer
  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setProvider(provider);
      setSigner(signer);
      
      // Initialize contract instances
      const zowieTokenContract = new ethers.Contract(tokenContractAddress, TokenContractABI, signer);
      const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractABI, signer);
      setTokenContract(zowieTokenContract);
      setStakingContract(stakingContract);
      setIsConnected(true);
    } else {
      alert('Please install MetaMask!');
      setIsConnected(false);
    }
  };

  // Stake tokens
  const handleStake = async () => {
    if (!signer || !stakingContract || !TokenContract) return;
     
    // Approve the staking contract to spend the user's tokens
    const approveTx = await TokenContract.approve(stakingContractAddress, ethers.parseUnits(stakeAmount, TOKEN_DECIMALS));
    await approveTx.wait();
  
    // Now that the approval is done, stake the tokens
    const stakeTx = await stakingContract.stake(ethers.parseUnits(stakeAmount, TOKEN_DECIMALS));
    await stakeTx.wait();
  };

  // Stake All tokens
  const handleStakeAll = async () => {
    if (!signer || !stakingContract || !TokenContract) return;
  
    try {
      // Fetch the user's token balance
      const userBalance = await TokenContract.balanceOf(signer.getAddress());
  
      // Approve the staking contract to spend the user's tokens
      const approveTx = await TokenContract.approve(stakingContractAddress, userBalance);
      await approveTx.wait();
  
      // Stake the full balance of tokens
      const stakeTx = await stakingContract.stake(userBalance);
      await stakeTx.wait();
  
      // Optionally, update the UI to reflect the change
      setStakeAmount(ethers.formatUnits(userBalance, TOKEN_DECIMALS));
    } catch (error) {
      // Handle any errors that occur during the staking process
      console.error("Failed to stake all tokens: ", error);
    }
  };

  const handleUnstakeAll = async () => {
    if (!signer || !stakingContract || !TokenContract) return;
  
    try {
      // Fetch the user's staked balance
      const stakedBalance = await stakingContract.stakeOf(signer.getAddress());
  
      // Unstake the full staked balance
      const unstakeTx = await stakingContract.unstake(stakedBalance);
      await unstakeTx.wait();
  
      // Optionally, update the UI to reflect the change
      setStakeAmount(ethers.formatUnits(stakedBalance, TOKEN_DECIMALS));
    } catch (error) {
      // Handle any errors that occur during the unstaking process
      console.error("Failed to unstake all tokens: ", error);
    }
  };
  
  const handleClaimRewards = async () => {
    if (!signer || !stakingContract || !TokenContract) return;
  
    try {
      // Call the claimReward function on the staking contract
      const claimTx = await stakingContract.claimReward();
      await claimTx.wait();
  
      // Optionally, update the UI to reflect the change
      // You may need to fetch the updated reward balance and display it to the user
    } catch (error) {
      // Handle any errors that occur during the claiming process
      console.error("Failed to claim rewards: ", error);
    }
  };

return (
  <div className="main-container">
    <div className="stake-navbar">
      <div className="header">
        <h2 className="header-section-title">Staking Platform</h2>
      </div>
      <button className="connect-wallet-btn" onClick={connectWallet}>
        {isConnected ? "Connected" : "Connect Wallet"}
      </button>
    </div>
     <div className="body-container">
     {isConnected ? (
      <>
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
            Stake Amount
        </button>
          <button onClick={handleStakeAll} className="stake-all-btn">
              Stake All Tokens
          </button>
        </div>
         <div className="unstake-section">
           <h2 className="section-title">Unstake Tokens</h2>
            <button onClick={handleUnstakeAll} className="unstake-btn">
             Unstake Tokens
            </button>
         </div>
       </div>
 
       <div className="claim-section">
         <h2 className="section-title">Claim Tokens</h2>
          <button onClick={handleClaimRewards} className="claim-btn">
            Claim Tokens
          </button>
       </div>
        </>
    ) : (
      <MetamaskLogo />
    )}
     </div>
     <footer className="footer">
      <p className="footer-paragraph">Staking Project Created For Your Eyes Only</p>
    </footer>
   </div>
 );
}

export default Stake;
