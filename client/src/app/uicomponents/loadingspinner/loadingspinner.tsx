import React from 'react';
import { BarLoader } from 'react-spinners';

const Loading: React.FC = () => {
  return (
    <div style={styles.loadingContainer}>
      <BarLoader width={150} color={"#123abc"} loading={true} />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }
};

export default Loading;