import logo from '../logo.svg'
import React from 'react'
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
      <div className="logo">
          <img src={logo} alt="Logo" width={32} height={32} />
        </div>
        <div className="tabs-container">
            <div>
                <Link to="/" className="tab-item">Home</Link>
            </div>
            <div>
                <Link to="/more" className="tab-item">More</Link>
            </div>
        </div>
        <Link to="/stake" target="_blank"><button className="dapp">DApp</button></Link>
      </nav>

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

    <footer className="footer">
      <p className="footer-paragraph">Staking Project Created For Your Eyes Only</p>
    </footer>
  </div>
  )
}

export default Home;
