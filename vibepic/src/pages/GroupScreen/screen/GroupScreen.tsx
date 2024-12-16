import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import DrawerComponent from '../../../components/DrawerComponent';
import axios from 'axios';
import UserImage from '../../HomeScreen/components/UserImage';
import { Image } from '../../../models/Image';
import { Group } from '../../../models/Group';
import { useImageLoader } from '../../../hooks/useImageLoader';
import UserDropdown from '../../../components/UserDropdown';
import useBreakpoints from '../../../hooks/useBreakpoints';
import LoadingComponent from '../../../components/LoadingComponent';
import NotificationComponent from '../../../components/NotificationComponent';

const GroupScreen: React.FC = () => {
  const { isMediumScreen, isVerySmallScreen } = useBreakpoints();
  const { groupName = '' } = useParams<{ groupName: string }>();
  const [joined, setJoined] = useState(true);
  const [groupInfo, setGroupInfo] = useState<Group>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const authToken = localStorage.getItem('token') || '';
  const [notificationText, setNotificaitonText] = useState('');

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
    `${process.env.REACT_APP_BACKEND_URL}/images/group`,
    authToken,
  );

  const joinGroup = async (groupName: string) => {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user-groups/${groupName}/join`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then(() => {
        setNotificaitonText('You have successfully joined the group!');
        setJoined(true);
      })
      .catch(error => {
        console.error('Error joining the group:', error);
      });
  }

  useEffect(() => {
    if(joined) {
      getImages(dateFilter, likedFilter, groupName);
    }
  }, [dateFilter, likedFilter]);

  useEffect(() => {
    const checkGroupMembership = async (groupName: string) => {
      setIsLoading(true);
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user-groups/${groupName}/is-member`, { 
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then(response => {
          if (response.data.isMember) {
            getImages('','',groupName);
          } else {
            setJoined(false);
          }
        })
        .catch(error => {
          console.error('Error checking group membership:', error);
        }).finally(() => {
          // setIsLoading(false);
        });
    };  

    const getGroupInfo = async () => {
      setIsLoading(true);
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user-groups/${groupName}/details`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then(response => {
          setJoined(true);
          setGroupInfo(response.data);
        })
        .catch(error => {
          console.error('Error fetching groups:', error);
        }).finally(() => {
          setIsLoading(false);
        });
    };
    
    getGroupInfo();
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
        !isVerySmallScreen || isMobileDrawerOpen ?
          <DrawerComponent 
            dateFilter={dateFilter} 
            updateDateFilter={updateDateFilter} 
            likedFilter={likedFilter}
            updateLikeFilter={updateLikeFilter}
            isMobileDrawerOpen={isMobileDrawerOpen}
            setIsMobileDrawerOpen={setIsMobileDrawerOpen} 
          />
          :
          <Box 
            sx={{ 
              backgroundColor: '#00A2E8',
              position: 'fixed', 
              width: '100%',
              bottom: 0,
              zIndex: 1000,
            }}
          >
            <Button variant="text" style={{ fontSize: 24, color: 'white' }} onClick={() => setIsMobileDrawerOpen(true)}>Filters</Button>
          </Box>
        }
        {
        !isMobileDrawerOpen &&
          <Box component="main" sx={{ flexGrow: 1 }}>
            {joined ? (
              <Box component="main" sx={{ flexGrow: 1, paddingTop: 5, paddingLeft: isVerySmallScreen ? 1 : isMediumScreen ? 0 : 5, marginBottom: isVerySmallScreen ? 5 : 0 }}>
                <UserDropdown />
                <Typography fontSize={36}>
                  {groupInfo?.name} group
                </Typography>
                <Typography fontSize={24}>
                  {groupInfo?.description}
                </Typography>
                <Typography fontSize={18}>
                  Members: {groupInfo?.memberCount}
                </Typography>
                {visibleImages.map((image: Image) => (
                    <UserImage key={image.id} image={image} liked={likeStatuses[image.id] || false} authToken={authToken} />
                  ))}
                <NotificationComponent notificationText={notificationText} setNotificationText={setNotificaitonText}/>
            </Box>
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="80vh">
                <Typography fontSize={36}>
                  You must join this group to view its photos
                </Typography>
                <Button variant="contained" style={{ color: 'red', backgroundColor: 'yellow' }} onClick={() => joinGroup(groupName)}>
                  Join Group
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
