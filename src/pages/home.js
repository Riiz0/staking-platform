import React from 'react'
import { Link } from 'react-router-dom';

//imports
import Navbar from '../components/navbar';
import Footer from '../components/footer';

function Home() {
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
    <h2 className="header2-text">Staking Pool Information</h2>
    <p className="paragraph-text">This is the staking pool information.</p>
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
