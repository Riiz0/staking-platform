import React, { useEffect } from 'react';
import ModelViewer from '@metamask/logo';

function MetamaskLogo() {
  useEffect(() => {
    // Create an instance of the logo viewer
    const viewer = ModelViewer({
      pxNotRatio: true,
      width: 500,
      height: 400,
      followMouse: false,
      slowDrift: false,
    });

    // Add the viewer to the DOM
    const container = document.getElementById('logo-container');
    container.appendChild(viewer.container);

    // Look at something on the page (adjust x and y coordinates as needed)
    viewer.lookAt({
      x: 100,
      y: 100,
    });

    // Enable mouse follow
    viewer.setFollowMouse(true);

    // Clean up the viewer when the component unmounts
    return () => {
      viewer.stopAnimation();
      container.removeChild(viewer.container);
    };
  }, []);

  return (
    <div id="logo-container" style={{ width: '500px', height: '1000px' }}>
      {/* This is where the Metamask logo will be rendered */}
    </div>
  );
}

export default MetamaskLogo;