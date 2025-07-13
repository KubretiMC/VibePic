import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import DrawerComponent from '../../../components/DrawerComponent';
import UserImage from '../../HomeScreen/components/UserImage';
import { Image } from '../../../models/Image';
import { Group } from '../../../models/Group';
import { useImageLoader } from '../../../hooks/useImageLoader';
import UserDropdown from '../../../components/UserDropdown';
import useBreakpoints from '../../../hooks/useBreakpoints';
import LoadingComponent from '../../../components/LoadingComponent';
import NotificationComponent from '../../../components/NotificationComponent';
import { useTranslation } from 'react-i18next';
import { api } from '../../../api/api';

const GroupScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isMediumScreen, isSmallScreen } = useBreakpoints();
  const { groupName = '' } = useParams<{ groupName: string }>();
  const [joined, setJoined] = useState(true);
  const [groupInfo, setGroupInfo] = useState<Group>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notificationText, setNotificaitonText] = useState('');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<string>('');

  const { 
    visibleImages, 
    likeStatuses, 
    dateFilter, 
    likedFilter, 
    isMobileDrawerOpen,
    getImages, 
    updateDateFilter, 
    updateLikeFilter, 
    setVisibleImages, 
    setImagesData,
    setIsMobileDrawerOpen
  } = useImageLoader(
   '/images/group', 
  );

  const getGroupInfo = async () => {
    setIsLoading(true);
    try {
      setIsLoading(true);
    
      const response = await api.get(`/user-groups/${groupName}/details`);
      setJoined(true);
      setGroupInfo(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const joinGroup = async (groupName: string) => {
    try {
      await api.post(`/user-groups/${groupName}/join`, {});
    
      setNotificaitonText(t('JOINING_GROUP_SUCCESSFULL'));
      getGroupInfo();
      setJoined(true);
    } catch (error) {
      console.error('Error joining the group:', error);
    }
  }

  useEffect(() => {
    if(joined) {
      getImages(dateFilter, likedFilter, groupName);
    }
  }, [dateFilter, likedFilter, joined]);

  useEffect(() => {
    const checkGroupMembership = async (groupName: string) => {
      setIsLoading(true);
      try {
        const response = await api.get(`/user-groups/${groupName}/is-member`);
      
        if (response.data.isMember) {
          getImages('', likedFilter, groupName);
          getGroupInfo();
        } else {
          setJoined(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking group membership:', error);
      }
    };
    
    setImagesData([]);
    setVisibleImages([]);
    checkGroupMembership(groupName);
  }, [groupName]);

  return (
    <Box display="flex">
      {isLoading ? (
         <LoadingComponent />
      ) : 
      (
      <>
        {
        !isSmallScreen || isMobileDrawerOpen ?
          <DrawerComponent 
            updateDateFilter={updateDateFilter} 
            likedFilter={likedFilter}
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
        {
        !isMobileDrawerOpen &&
          <Box component="main" sx={{ flexGrow: 1 }}>
            {joined ? (
              <Box 
                component="main" 
                sx={{ 
                  flexGrow: 1, 
                  paddingTop: 5, 
                  paddingLeft: isSmallScreen ? 1 : isMediumScreen ? 0 : 5, 
                  marginBottom: isSmallScreen ? 5 : 0 
                }}
              >
                <UserDropdown />
                {groupInfo &&
                  <Typography fontSize={36}>
                    {i18n.language === 'en' ? 
                      `${groupInfo.name.charAt(0).toUpperCase()}${groupInfo.name.slice(1).toLowerCase()} group`
                      :
                      `Група за ${t(groupInfo?.name).toLowerCase()}`
                    }
                  </Typography>
                }
                <Typography fontSize={24}>
                  {groupInfo?.description}
                </Typography>
                <Typography fontSize={18}>
                  {t('MEMBERS')}: {groupInfo?.memberCount}
                </Typography>
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
                <NotificationComponent notificationText={t(`${notificationText}`)} setNotificationText={setNotificaitonText}/>
            </Box>
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="80vh">
                <Typography fontSize={36} paddingX={8}>
                  {t('JOIN_GROUP_INFO')}
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ 
                    color: 'red',
                    backgroundColor: 'yellow' 
                  }} 
                  onClick={() => joinGroup(groupName)}
                >
                  {t('JOIN_GROUP')}
                </Button>
              </Box>
            )}
          </Box>
        }
        
      </>
    )}
    </Box>
  );
};

export default GroupScreen;
