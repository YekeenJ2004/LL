import React from 'react';
import {BarLoader} from 'react-spinners';

const Loading = () => {
    return (
      <div style={styles.loadingContainer}>
        <BarLoader size={150} color={"#123abc"} loading={true} />
      </div>
    );
  };
  
  const styles = {
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }
  };
  
  export default Loading;