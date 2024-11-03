import React, { useState, useEffect } from 'react';
import { Drawer, Box } from '@mui/material';
import Category from '../components/Category';
import image1 from '../../../images/image-1.png';
import image2 from '../../../images/image-2.png';
import image3 from '../../../images/image-3.png';
import UserImage from '../components/UserImage';
import axios from 'axios';
import { User } from '../../../models/User';
import { Image } from '../../../models/Image';

const HomeScreen: React.FC = () => {
  const [imagesData, setImagesData] = useState<Image[]>([]);
  const [user, setUser]= useState<User>();
  const [visibleImages, setVisibleImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMoreImages = () => {
      setLoading(true);
  
      setTimeout(() => {
        const nextImages = imagesData.slice(visibleImages.length, visibleImages.length + 10);
        setVisibleImages((prev) => [...prev, ...nextImages]);
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

  useEffect(() => {
    axios.get('http://localhost:3001/images')
      .then(response => {
        const images = response.data;
        setImagesData(images);
        setVisibleImages(images.slice(0, 10))
      })
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3001/users')
      .then(response => {
        setUser(response.data[0]);
      })
      .catch(error => console.error('Error fetching images:', error));
  }, []);

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
        {visibleImages.map((image: Image, index: number) => (
          <UserImage key={index} image={image} />
        ))}
      </Box>
    </Box>
  );
};

export default HomeScreen;
