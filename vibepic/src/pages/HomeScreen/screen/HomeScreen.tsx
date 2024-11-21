import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import UserImage from '../components/UserImage';
import axios from 'axios';
import { Image } from '../../../models/Image';
import DrawerComponent from '../../../components/DrawerComponent';

const HomeScreen: React.FC = () => {
  const [imagesData, setImagesData] = useState<Image[]>([]);
  const [visibleImages, setVisibleImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [likeStatuses, setLikeStatuses] = useState<{ [imageId: string]: boolean }>({});
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const loadMoreImages = async () => {
      setLoading(true);
  
      setTimeout(async () => {
        const nextImages = imagesData.slice(visibleImages.length, visibleImages.length + 10);
        setVisibleImages((prev) => [...prev, ...nextImages]); 
        const newImageIds = nextImages.map((img) => img.id).join(',');;
        const likeStatusResponse = await axios.get(`http://localhost:3001/likes/batch-likes-status`, {
          params: { userId: '59995a1b-a2c6-11ef-aafe-8c1645e72e09', imageIds: newImageIds },
        });
        setLikeStatuses((prev) => ({
          ...prev,
          ...likeStatusResponse.data.likeStatuses,
        }));
        
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

  const getImages = async (week?: string) => {
    try {
      const response = await axios.get('http://localhost:3001/images',  {
        params: { week: week || undefined },
      });
      const images = response.data;
      setImagesData(images);
      setVisibleImages(images.slice(0, 10));
      const imageIds = images.map((img: Image) => img.id).join(',');;
      const likeStatusResponse = await axios.get(`http://localhost:3001/likes/batch-likes-status`, {
        params: { userId: '59995a1b-a2c6-11ef-aafe-8c1645e72e09', imageIds },
      });
      setLikeStatuses(likeStatusResponse.data.likeStatuses);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
      getImages(dateFilter);
  }, [dateFilter]);

  return (
    <Box display="flex">
      <DrawerComponent dateFilter={dateFilter} setDateFilter={setDateFilter} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {visibleImages.map((image: Image) => (
          <UserImage key={image.id} image={image} liked={likeStatuses[image.id] || false} />
        ))}
      </Box>
    </Box>
  );
};

export default HomeScreen;
