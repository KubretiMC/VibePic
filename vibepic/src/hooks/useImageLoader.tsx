import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Image } from '../models/Image';

export const useImageLoader = (
  endpoint: string,
  authToken: string
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
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${authToken}` },
          params: {
            week: week || undefined,
            mostLiked: mostLiked || undefined,
            groupName: groupName || undefined
          },
        });
        const images = response.data;
        setImagesData(images);
        setVisibleImages(images.slice(0, 10));
        const imageIds = images.map((img: Image) => img.id).join(',');
        const likeStatusResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/likes/batch-likes-status`, {
          headers: { Authorization: `Bearer ${authToken}` },
          params: { imageIds },
        });
        setLikeStatuses(likeStatusResponse.data.likeStatuses);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    },
    [authToken, endpoint]
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
      if (imagesData.length - visibleImages.length >= 10) {
        nextImages = imagesData.slice(visibleImages.length, visibleImages.length + 10);
      } else {
        nextImages = imagesData.slice(visibleImages.length, imagesData.length);
      }
      setVisibleImages((prev) => [...prev, ...nextImages]);
      const newImageIds = nextImages.map((img) => img.id).join(',');
      const likeStatusResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/likes/batch-likes-status`, {
        headers: { Authorization: `Bearer ${authToken}` },
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
  }, [loading, visibleImages.length, imagesData, authToken]);

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
    setIsMobileDrawerOpen
  };
};
