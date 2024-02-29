import React from 'react'
import { Link } from 'react-router-dom';

//imports
import Navbar from '../components/navbar';
import Footer from '../components/footer';

function More() {
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
  <div className="dark-background">
  <div className="transparent-container">
    <h2 className="header2-text">More Information</h2>
    <p className="more-space-between"></p>
    <p className="header3-text">Key Features and Functionalities</p>
    <p className="more-paragraph-text">Users can stake their tokens by calling the stake function, specifying the amount they wish to stake. Similarly, they can unstake their tokens by calling the unstake function, which also calculates and distributes rewards up to the point of unstaking.</p>
    <p className="more-paragraph-text">The platform includes a mechanism for distributing rewards to stakers. Rewards are calculated based on the staking time and the current reward rate, which is determined by an annual percentage yield (APY) set at the contract's deployment.</p>
    <p className="more-paragraph-text">The contract allows for a portion of tokens to be burned during the unstaking process, reducing the total supply and potentially increasing the value of the remaining tokens. This is achieved through a call to a burnTokens function.</p>
    <p className="more-paragraph-text">The contract inherits from OpenZeppelin's Ownable, Pausable, and ReentrancyGuard contracts, incorporating best practices for security and governance. It also includes a grace period before a user can stake again, reducing the risk of front-running attacks.</p>
    <p className="more-paragraph-text">The contract emits events for staking, unstaking, and reward payouts, which can be listened to by the frontend to provide real-time updates to users.</p>
    <p className="more-paragraph-text">The contract maintains a total count of staked tokens and total rewards claimed, allowing for an overview of the platform's activity and performance.</p>
    <p className="more-paragraph-text"></p>
        </div>
        </div>
      </div>
      </div>
    </main>

    {/* Footer */}
    <Footer />
  </div>
  )
}

export default More;
