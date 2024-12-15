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

const GroupScreen: React.FC = () => {
  const { isMediumScreen, isVerySmallScreen } = useBreakpoints();
  const { groupName = '' } = useParams<{ groupName: string }>();
  const [joined, setJoined] = useState(false);
  const [groupInfo, setGroupInfo] = useState<Group>();
  const authToken = localStorage.getItem('token') || ''; 

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
        alert('You have successfully joined the group!');
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
  }, [joined, dateFilter, groupName, likedFilter, getImages]);

  useEffect(() => {
    const checkGroupMembership = async (groupName: string) => {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user-groups/${groupName}/is-member`, { 
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then(response => {
          if (response.data.isMember) {
            getImages('','',groupName);
            setJoined(true);
          }
        })
        .catch(error => {
          console.error('Error checking group membership:', error);
        });
    };  

    const getGroupInfo = async () => {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user-groups/${groupName}/details`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then(response => {
          setGroupInfo(response.data);
        })
        .catch(error => {
          console.error('Error fetching groups:', error);
        });
    };

    getGroupInfo();
    setJoined(false);
    setImagesData([]);
    setVisibleImages([]);
    checkGroupMembership(groupName);
  }, [groupName, authToken, getImages, setImagesData, setVisibleImages]);

  return (
    <Box display="flex">
      {!isVerySmallScreen || isMobileDrawerOpen ?
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
      {!isMobileDrawerOpen &&
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
              {visibleImages.length > 0 ?
                visibleImages.map((image: Image) => (
                  <UserImage key={image.id} image={image} liked={likeStatuses[image.id] || false} authToken={authToken} />
                ))
                :
                <Typography style={{marginTop: 180, fontSize: 28}}>No images in this group</Typography>
              }
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
    </Box>
  );
};

export default GroupScreen;
