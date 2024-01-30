import logo from '../assets/logo.svg'
import React from 'react'
import { Link } from 'react-router-dom';

function Navbar() {
    return (
          <nav className="navbar">
          <div className="logo">
            <img src={logo} alt="Logo" width={52} height={52} />
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
    )
}

export default Navbar;
