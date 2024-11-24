import React from 'react';
import Lottie from 'lottie-react';
import animationData from './admin-animation.json';

const Loading = () => {


  return (
    <>
        <div style={styles.container}>
          <Lottie animationData={animationData} style={styles.animation} />
        </div>
    </>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    zIndex: '9999', 
  },
  animation: {
    width: '150px',
    height: '150px',
  },
};

export default Loading;
