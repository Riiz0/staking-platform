import React from "react";

const LoadingScreen = ({ transactionType }) => {
    return (
      <div className="loading-screen">
        <div className="loading-content">
        <p>{transactionType || 'Processing your transaction...'}</p>
        <div className="spinner"></div>
        </div>
      </div>
    );
  };

  
  export default LoadingScreen;