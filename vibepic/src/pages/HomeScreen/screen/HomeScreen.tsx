import React from 'react';
import { Box, Button } from '@mui/material';
import UserImage from '../components/UserImage';
import { Image } from '../../../models/Image';
import DrawerComponent from '../../../components/DrawerComponent';
import { useImageLoader } from '../../../hooks/useImageLoader';
import UserDropdown from '../../../components/UserDropdown';
import useBreakpoints from '../../../hooks/useBreakpoints';

const HomeScreen: React.FC = () => {
  const { isMediumScreen, isVerySmallScreen } = useBreakpoints();
  const authToken = localStorage.getItem('token') || ''; 
  const { 
    visibleImages, 
    likeStatuses, 
    dateFilter, 
    likedFilter,
    isMobileDrawerOpen, 
    updateDateFilter, 
    updateLikeFilter, 
    setIsMobileDrawerOpen 
  } = useImageLoader(
    `${process.env.REACT_APP_BACKEND_URL}/images`,
    authToken
  );

  return (
    <Box>
      <Box display="flex">
        {!isVerySmallScreen || isMobileDrawerOpen ?
          <DrawerComponent 
            dateFilter={dateFilter}
            likedFilter={likedFilter} 
            updateDateFilter={updateDateFilter} 
            updateLikeFilter={updateLikeFilter} 
            isMobileDrawerOpen={isMobileDrawerOpen}
            setIsMobileDrawerOpen={setIsMobileDrawerOpen} />
          :
          <Box 
            sx={{ 
              backgroundColor: '#00A2E8',
              position: 'fixed', 
              width: '100%',
              bottom: 0,
              zIndex: 1000,
              border: 0
            }}
          >
            <Button 
              variant="text" 
              sx={{ 
                fontSize: 24, 
                color: 'white' 
              }} 
              onClick={() => setIsMobileDrawerOpen(true)}>
                Filters
            </Button>
          </Box>
          }
          {!isMobileDrawerOpen && 
            <Box component="main" sx={{ flexGrow: 1, paddingTop: 6, paddingLeft: isVerySmallScreen ? 1 : isMediumScreen ? 0 : 5 }}>
              <UserDropdown />
              {visibleImages.map((image: Image) => (
                <UserImage key={image.id} image={image} liked={likeStatuses[image.id] || false} authToken={authToken} />
              ))}
            </Box>
          }
      </Box>
    </Box>
  );
};

export default HomeScreen;
