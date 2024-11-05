import React, { useState, useEffect } from 'react';
import { Drawer, Box } from '@mui/material';
import Category from '../components/Category';
import UserImage from '../components/UserImage';
import axios from 'axios';
import { User } from '../../../models/User';
import { Image } from '../../../models/Image';

const HomeScreen: React.FC = () => {
  const [imagesData, setImagesData] = useState<Image[]>([]);
  const [user, setUser] = useState<User>();
  const [visibleImages, setVisibleImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [likeStatuses, setLikeStatuses] = useState<{ [imageId: number]: boolean }>({});

  useEffect(() => {
    const loadMoreImages = async () => {
      setLoading(true);
  
      setTimeout(async () => {
        const nextImages = imagesData.slice(visibleImages.length, visibleImages.length + 10);
        setVisibleImages((prev) => [...prev, ...nextImages]);
        
        if (user) {
          const newImageIds = nextImages.map((img) => img.id).join(',');;
          const likeStatusResponse = await axios.get(`http://localhost:3001/likes/batch-likes-status`, {
            params: { userId: user.id, imageIds: newImageIds },
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
  }, [loading, visibleImages.length, imagesData, user]);

  const getImages = async () => {
    try {
      const response = await axios.get('http://localhost:3001/images');
      const images = response.data;
      setImagesData(images);
      setVisibleImages(images.slice(0, 10));

      if (user) {
        const imageIds = images.map((img: Image) => img.id).join(',');;
        const likeStatusResponse = await axios.get(`http://localhost:3001/likes/batch-likes-status`, {
          params: { userId: user.id, imageIds },
        });
        setLikeStatuses(likeStatusResponse.data.likeStatuses);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      setUser(response.data[0]);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user]);

  return (
    <Box display="flex">
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 200, boxSizing: 'border-box', backgroundColor: '#00A2E8' },
        }}
      >
        <Box p={2} role="presentation">
          <Category categoryName='Category' items={["Animals", "Nature", "Travel", "Art"]} />
          <Category categoryName='Time' items={["This week", "Last 2 weeks", "Last month", "All time"]} />
          <Category categoryName='Popularity' items={["Most liked images", "Most liked users"]} />
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {visibleImages.map((image: Image) => (
          <UserImage key={image.id} image={image} liked={likeStatuses[image.id] || false} />
        ))}
      </Box>
    </Box>
  );
};

export default HomeScreen;
