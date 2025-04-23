import { useState, useEffect, useCallback } from 'react';
import { Image } from '../models/Image';
import { api } from '../api/api';

export const useImageLoader = (
  endpoint: string
) => {
  const [loading, setLoading] = useState(false);
  const [imagesData, setImagesData] = useState<Image[]>([]);
  const [visibleImages, setVisibleImages] = useState<Image[]>([]);
  const [likeStatuses, setLikeStatuses] = useState<{ [imageId: string]: boolean }>({});
  const [dateFilter, setDateFilter] = useState('');
  const [likedFilter, setLikedFilter] = useState('');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const getImages = useCallback(
    async (week?: string, mostLiked?: string, groupName?: string) => {
      try {
        console.log('mostLiked', mostLiked);
        const response = await api.get(endpoint, {
          params: {
            week: week,
            mostLiked: mostLiked,
            groupName: groupName,
          },
        });
  
        const images = response.data;
        setImagesData(images);
        setVisibleImages(images.slice(0, 3));
  
        const imageIds = images.map((img: Image) => img.id).join(',');
        const likeStatusResponse = await api.get('/likes/batch-likes-status', {
          params: { imageIds },
        });
        setLikeStatuses(likeStatusResponse.data.likeStatuses);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    },
    [endpoint]
  );
  
  const updateDateFilter = (newDateFilter: string) => {
    if (dateFilter === newDateFilter) {
      setDateFilter('');
    } else {
      setDateFilter(newDateFilter);
    }
    setIsMobileDrawerOpen(false);
  };

  const updateLikeFilter = (newLikeFilter: string) => {
    setVisibleImages([]);
    if (likedFilter === newLikeFilter) {
      setLikedFilter('');
    } else {
      setLikedFilter('images');
    }
    setIsMobileDrawerOpen(false);
  };

  useEffect(() => {
    getImages(dateFilter, likedFilter);
  }, [dateFilter, likedFilter, getImages]);

  useEffect(() => {
    const loadMoreImages = async () => {
      setLoading(true);
      let nextImages: Image[] = [];
      if (imagesData.length - visibleImages.length >= 3) {
        nextImages = imagesData.slice(visibleImages.length, visibleImages.length + 3);
      } else {
        nextImages = imagesData.slice(visibleImages.length, imagesData.length);
      }
      setVisibleImages((prev) => [...prev, ...nextImages]);
      const newImageIds = nextImages.map((img) => img.id).join(',');
      const likeStatusResponse = await api.get('/likes/batch-likes-status', {
        params: { imageIds: newImageIds },
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

  return {
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
    setIsMobileDrawerOpen,
  };
};
