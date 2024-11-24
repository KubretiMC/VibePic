import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import UserImage from '../components/UserImage';
import { Image } from '../../../models/Image';
import DrawerComponent from '../../../components/DrawerComponent';
import { useImageLoader } from '../../../hooks/useImageLoader';

const HomeScreen: React.FC = () => {
  const { visibleImages, likeStatuses, dateFilter, likedFilter, updateDateFilter, updateLikeFilter } = useImageLoader(
    `http://localhost:3001/images`,
    '59995a1b-a2c6-11ef-aafe-8c1645e72e09'
  );

  useEffect(() => {
    console.log('512521512');
  }, [visibleImages]);

  return (
    <Box display="flex">
      <DrawerComponent dateFilter={dateFilter} likedFilter={likedFilter} updateDateFilter={updateDateFilter} updateLikeFilter={updateLikeFilter} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {visibleImages.map((image: Image) => (
          <UserImage key={image.id} image={image} liked={likeStatuses[image.id] || false} />
        ))}
      </Box>
    </Box>
  );
};

export default HomeScreen;
