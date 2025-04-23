import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import UserImage from '../components/UserImage';
import { Image } from '../../../models/Image';
import DrawerComponent from '../../../components/DrawerComponent';
import { useImageLoader } from '../../../hooks/useImageLoader';
import UserDropdown from '../../../components/UserDropdown';
import useBreakpoints from '../../../hooks/useBreakpoints';
import { useTranslation } from 'react-i18next';

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isMediumScreen, isSmallScreen } = useBreakpoints();
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<string>('');
  const { 
    visibleImages, 
    likeStatuses, 
    likedFilter,
    isMobileDrawerOpen, 
    updateDateFilter, 
    updateLikeFilter, 
    setIsMobileDrawerOpen 
  } = useImageLoader(
    '/images'
  );

  return (
    <Box>
      <Box display="flex">
        {!isSmallScreen || isMobileDrawerOpen ?
          <DrawerComponent
            likedFilter={likedFilter} 
            updateDateFilter={updateDateFilter} 
            updateLikeFilter={updateLikeFilter} 
            isMobileDrawerOpen={isMobileDrawerOpen}
            setIsMobileDrawerOpen={setIsMobileDrawerOpen}
            selectedWeekFilter={selectedWeekFilter}
            setSelectedWeekFilter={setSelectedWeekFilter}  
          />
          :
          <Box 
            sx={{ 
              backgroundColor: '#00A2E8',
              position: 'fixed', 
              width: '100%',
              bottom: 0,
              zIndex: 1,
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
                {t('FILTERS')}
            </Button>
          </Box>
          }
          {!isMobileDrawerOpen && 
            <Box component="main" sx={{ flexGrow: 1, paddingTop: 6, paddingLeft: isSmallScreen ? 1 : isMediumScreen ? 0 : 5 }}>
              <UserDropdown />
              {visibleImages.length > 0 ?
                <Box sx={{ marginBottom: 10 }}>
                  {visibleImages.map((image: Image) => (
                    <UserImage key={image.id} image={image} liked={likeStatuses[image.id] || false} />
                  ))}
                </Box>
                :
                <Box sx={{ fontSize: 32, marginTop: 20 }}>
                  No images found
                </Box>
              }
            </Box>
          }
      </Box>
    </Box>
  );
};

export default HomeScreen;
