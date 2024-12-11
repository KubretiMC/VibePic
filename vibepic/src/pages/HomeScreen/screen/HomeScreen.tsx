import React from 'react';
import { Box } from '@mui/material';
import UserImage from '../components/UserImage';
import { Image } from '../../../models/Image';
import DrawerComponent from '../../../components/DrawerComponent';
import { useImageLoader } from '../../../hooks/useImageLoader';
import UserDropdown from '../../../components/UserDropdown';
import useBreakpoints from '../../../hooks/useBreakpoints';

const HomeScreen: React.FC = () => {
  const { isMediumScreen } = useBreakpoints();
  const authToken = localStorage.getItem('token') || ''; 
  const { visibleImages, likeStatuses, dateFilter, likedFilter, updateDateFilter, updateLikeFilter } = useImageLoader(
    `http://localhost:3001/images`,
    authToken
  );

  return (
    <Box display="flex">
      <DrawerComponent dateFilter={dateFilter} likedFilter={likedFilter} updateDateFilter={updateDateFilter} updateLikeFilter={updateLikeFilter} />
      <Box component="main" sx={{ flexGrow: 1, paddingTop: 5, paddingLeft: isMediumScreen ? 0 : 5 }}>
        <UserDropdown />
        {visibleImages.map((image: Image) => (
          <UserImage key={image.id} image={image} liked={likeStatuses[image.id] || false} authToken={authToken} />
        ))}
      </Box>
    </Box>
  );
};

export default HomeScreen;
