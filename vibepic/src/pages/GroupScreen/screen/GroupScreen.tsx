import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import DrawerComponent from '../../../components/DrawerComponent';
import axios from 'axios';
import UserImage from '../../HomeScreen/components/UserImage';
import { Image } from '../../../models/Image';
import { Group } from '../../../models/Group';

const GroupScreen: React.FC = () => {
  const { groupName = '' } = useParams<{ groupName: string }>();
  const [imagesData, setImagesData] = useState<Image[]>([]);
  const userId = '59995a1b-a2c6-11ef-aafe-8c1645e72e09';
  const [visibleImages, setVisibleImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const [likeStatuses, setLikeStatuses] = useState<{ [imageId: string]: boolean }>({});
  const [groupInfo, setGroupInfo] = useState<Group>();

  useEffect(() => {
    const loadMoreImages = async () => {
      setLoading(true);
  
      setTimeout(async () => {
        const nextImages = imagesData.slice(visibleImages.length, visibleImages.length + 10);
        setVisibleImages((prev) => [...prev, ...nextImages]);
        
        if (userId) {
          const newImageIds = nextImages.map((img) => img.id).join(',');;
          const likeStatusResponse = await axios.get(`http://localhost:3001/likes/batch-likes-status`, {
            params: { userId, imageIds: newImageIds },
          });
          setLikeStatuses((prev) => ({
            ...prev,
            ...likeStatusResponse.data.likeStatuses,
          }));
        }
        
        setLoading(false);
      }, 1000);
    };

    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
        loadMoreImages();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, visibleImages.length, imagesData]);

  const checkGroupMembership = async (groupName: string) => {
    await axios.get(`http://localhost:3001/user-groups/${groupName}/is-member`, { params: { userId } })
      .then(response => {
        if (response.data.isMember) {
          getGroupImages(groupName);
          setJoined(true);
        }
      })
      .catch(error => {
        console.error('Error checking group membership:', error);
      });
  };  

  const joinGroup = async (groupName: string) => {
    await axios.post(`http://localhost:3001/user-groups/${groupName}/join`, { userId })
      .then(() => {
        alert('You have successfully joined the group!');
        setJoined(true);
      })
      .catch(error => {
        console.error('Error joining the group:', error);
      });
  }

  const getGroupImages = async (groupName: string) => {
    try {
      const response = await axios.get('http://localhost:3001/images/group', {
        params: { groupName },
      });
      
      const images = response.data;
      setImagesData(images);
      setVisibleImages(images.slice(0, 10));
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
      if(joined) {
        getGroupImages(groupName);
      }
  }, [joined]);

  const getGroupInfo = async () => {
    await axios.get(`http://localhost:3001/user-groups/${groupName}/details`)
      .then(response => {
        setGroupInfo(response.data);
      })
      .catch(error => {
        console.error('Error fetching groups:', error);
      });
  };

  useEffect(() => {
    getGroupInfo();
    setJoined(false);
    setImagesData([]);
    setVisibleImages([]);
    checkGroupMembership(groupName);
  }, [groupName]);

  return (
    <Box display="flex">
      <DrawerComponent />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {joined ? (
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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
                <UserImage key={image.id} image={image} liked={likeStatuses[image.id] || false} />
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
    </Box>
  );
};

export default GroupScreen;
