import React from 'react';
import { Box } from '@mui/material';
import { useImageLoader } from '../../hooks/useImageLoader';
import DrawerComponent from '../../components/DrawerComponent';

const ProfileScreen: React.FC = () => {
  const { dateFilter, likedFilter, updateDateFilter, updateLikeFilter } = useImageLoader(
    `http://localhost:3001/images`,
    '59995a1b-a2c6-11ef-aafe-8c1645e72e09'
  );
    
  return (
    <Box display="flex">
    <DrawerComponent dateFilter={dateFilter} likedFilter={likedFilter} updateDateFilter={updateDateFilter} updateLikeFilter={updateLikeFilter} />
  </Box>
  );
};

export default ProfileScreen;
