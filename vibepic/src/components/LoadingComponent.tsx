import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingComponent: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 9999,
      }}
    >
      <CircularProgress />
  </Box>
  );
};

export default LoadingComponent;
