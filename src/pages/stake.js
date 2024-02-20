import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { stakingContractABI } from '../abis/staking_abi';
import { TokenContractABI } from '../abis/token_abi';
import MetamaskLogo from '../components/metamaskLogo';
import LoadingScreen from '../components/loadingScreen';

// Contract addresses
const tokenContractAddress = '0x6936C261bF7edF969D06557cB85b7D19E5d43210';
const stakingContractAddress = '0x0e3f1495d0eA93F440bD2899FC2b5cef70FDb155';
const TOKEN_DECIMALS =  18;

function Stake() {
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [TokenContract, setTokenContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakedBalance, setStakedBalance] = useState(0);
  const [stakingDuration, setStakingDuration] = useState(0);
  const [unclaimedRewards, setUnclaimedRewards] = useState(0);
  const [transactionType, setTransactionType] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state variable for loading screen

  const apy =  4;

  // Connect to the Ethereum provider and get signer
  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setProvider(provider);
      setSigner(signer);
      
      // Initialize contract instances
      const tokenContract = new ethers.Contract(tokenContractAddress, TokenContractABI, signer);
      const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractABI, signer);
      setTokenContract(tokenContract);
      setStakingContract(stakingContract);
      setIsConnected(true);
    } else {
      alert('Please install MetaMask!');
      setIsConnected(false);
    }
  };

  // Stake tokens
  const handleStake = async () => {
    setTransactionType('Processing Approval transaction...');
    setIsLoading(true);
    if (!signer || !stakingContract || !TokenContract) return;

    try {
    // Approve the staking contract to spend the user's tokens
    const approveTx = await TokenContract.approve(stakingContractAddress, ethers.parseUnits(stakeAmount, TOKEN_DECIMALS));
    await approveTx.wait();
  
    // Now that the approval is done, stake the tokens
    setTransactionType('Processing Stake transaction...');
    const stakeTx = await stakingContract.stake(ethers.parseUnits(stakeAmount, TOKEN_DECIMALS));
    await stakeTx.wait();

    // Clear the stake amount input
    setStakeAmount(''); // Clear the input field
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
    setIsLoading(false); // Transaction failed, stop loading
    setTransactionType('');
  };

  // Stake All tokens
  const handleStakeAll = async () => {
    setTransactionType('Processing Approval transaction...');
    setIsLoading(true);
    if (!signer || !stakingContract || !TokenContract) return;
  
    try {
      // Fetch the user's token balance
      const userBalance = await TokenContract.balanceOf(signer.getAddress());
  
      // Approve the staking contract to spend the user's tokens
      const approveTx = await TokenContract.approve(stakingContractAddress, userBalance);
      await approveTx.wait();
  
      // Stake the full balance of tokens
      setTransactionType('Processing StakeAll transaction...');
      const stakeTx = await stakingContract.stake(userBalance);
      await stakeTx.wait();
  
      // Optionally, update the UI to reflect the change
      setStakeAmount(ethers.formatUnits(userBalance, TOKEN_DECIMALS));
    } catch (error) {
      // Handle any errors that occur during the staking process
      console.error("Failed to stake all tokens: ", error);
    }
    setIsLoading(false); // Transaction failed, stop loading
    setTransactionType('');
  };

  const handleUnstakeAll = async () => {
    setTransactionType('Processing Unstake transaction...');
    setIsLoading(true);
    if (!signer || !stakingContract || !TokenContract) return;
  
    try {
      // Fetch the user's staked balance
      const stakedBalanceWei = await stakingContract.stakingBalance(signer.getAddress());
      const stakedBalance = ethers.formatUnits(stakedBalanceWei, TOKEN_DECIMALS);
  
      // Unstake the full staked balance
      const unstakeTx = await stakingContract.unstake();
      await unstakeTx.wait();

      setTransactionType('Processing ClaimRewards transaction...');
      // Call the claimReward function on the staking contract
      const claimTx = await stakingContract.claimReward();
      await claimTx.wait();
  
      // Optionally, update the UI to reflect the change
      setStakeAmount(stakedBalance);
      fetchUserStakingInfo();
    } catch (error) {
      // Handle any errors that occur during the unstaking process
      console.error("Failed to unstake all tokens: ", error);
    }
    setIsLoading(false); // Transaction failed, stop loading
    setTransactionType('');
  };
  
  const handleClaimRewards = async () => {
    setTransactionType('Processing ClaimRewards transaction...');
    setIsLoading(true);
    if (!signer || !stakingContract || !TokenContract) return;
  
    try {
      // Call the claimReward function on the staking contract
      const claimTx = await stakingContract.claimReward();
      await claimTx.wait();
  
      // Optionally, update the UI to reflect the change
      fetchUserStakingInfo();
    } catch (error) {
      // Handle any errors that occur during the claiming process
      console.error("Failed to claim rewards: ", error);
    }
    setTransactionType('');
    setIsLoading(false); // Transaction failed, stop loading
  };

  const fetchUserStakingInfo = async () => {
    if (!signer || !stakingContract || !TokenContract) return;
  
    // Fetch user's staked balance
    const stakedBalanceWei = await stakingContract.stakingBalance(signer.getAddress());
    const stakedBalance = ethers.formatUnits(stakedBalanceWei, TOKEN_DECIMALS);
  
    // Fetch user's last update time from the public mapping
    const lastUpdateTime = await stakingContract.stakingTime(signer.getAddress());

    // Initialize staking duration to  0
    let stakingDurationDays =  0;

    // Only calculate staking duration if the user has staked before
    if (BigInt(lastUpdateTime) > BigInt(0)) {
    // Get the block timestamp as a BigInt
    const blockTimestamp = await provider.getBlock().then(block => BigInt(block.timestamp));

    // Calculate staking duration
    const durationSeconds = blockTimestamp - BigInt(lastUpdateTime);
    stakingDurationDays = Number(durationSeconds) / (60 *   60 *   24); // Convert seconds to days
  }

    // Fetch user's pending rewards
    let pendingRewardsWei;
    if (stakedBalance >  0) {
      // User is still staking, calculate pending rewards
      pendingRewardsWei = await stakingContract.calculateReward(signer.getAddress()) + await stakingContract.rewardBalance(signer.getAddress());
    } else {
      // User has unstaked, display reward balance
      pendingRewardsWei = await stakingContract.rewardBalance(signer.getAddress());
    }
    const pendingRewards = ethers.formatUnits(pendingRewardsWei, TOKEN_DECIMALS);

    // Update state with the fetched information
    setStakedBalance(stakedBalance);
    setStakingDuration(stakingDurationDays);
    setUnclaimedRewards(pendingRewards);
    setTimeout(fetchUserStakingInfo,   8000); // Update every   5 seconds
  };

  // Call this function when the user connects their wallet or when necessary
  fetchUserStakingInfo();

  useEffect(() => {
    // No need for cleanup if using setTimeout
    fetchUserStakingInfo();
  }, []);

  return (
    <div className="main-container">
    {isLoading && <LoadingScreen transactionType={transactionType} />}
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
              <div className="info-section">
              <h2 className="section-title">Your Staking Information</h2>
              <ul>
                <li><strong>Staked Balance:</strong> {stakedBalance}</li>
                <li><strong>Staking APY:</strong> {apy}%</li>
                <li><strong>Staking Duration:</strong> {Math.round(stakingDuration)} days</li>
                <li><strong>Unclaimed Rewards:</strong> {unclaimedRewards}</li>
            </ul>
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
