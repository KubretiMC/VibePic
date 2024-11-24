import { useState, useEffect } from 'react';
import axios from 'axios';
import { Image } from '../models/Image';

export const useImageLoader = (
  endpoint: string,
  userId: string,
) => {
  const [loading, setLoading] = useState(false);
  const [imagesData, setImagesData] = useState<Image[]>([]);
  const [visibleImages, setVisibleImages] = useState<Image[]>([]);
  const [likeStatuses, setLikeStatuses] = useState<{ [imageId: string]: boolean }>({});
  const [dateFilter, setDateFilter] = useState('');
  const [likedFilter, setLikedFilter] = useState('');

  useEffect(() => {
    const loadMoreImages = async () => {
      setLoading(true);
      let nextImages: Image[] = [];
      if(imagesData.length - visibleImages.length >= 10) {
        nextImages = imagesData.slice(visibleImages.length, visibleImages.length + 10);
      } else {
        nextImages = imagesData.slice(visibleImages.length, imagesData.length)
      }
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
    };

    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
        loadMoreImages();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, visibleImages.length, imagesData]);

  const getImages = async (week?: string, mostLiked?: string) => {
    try {
      const response = await axios.get('http://localhost:3001/images',  {
        params: { 
          week: week || undefined, 
          mostLiked: mostLiked || undefined
        },
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

  const updateDateFilter = (newDateFilter: string) => {
    if(dateFilter === newDateFilter) {
      setDateFilter('');
    } else {
      setDateFilter(newDateFilter);
    }
  }

  const updateLikeFilter = (newLikeFilter: string) => {
    setVisibleImages([]);
    if(likedFilter === newLikeFilter) {
      setLikedFilter('');
    } else {
      setLikedFilter('images');
    }
  }

  useEffect(() => {
      getImages(dateFilter, likedFilter);
  }, [dateFilter, likedFilter]);

  return {
    visibleImages,
    likeStatuses,
    dateFilter,
    likedFilter,
    setDateFilter,
    setLikedFilter,
    updateDateFilter,
    updateLikeFilter
  };
};
