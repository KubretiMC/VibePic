import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import DrawerComponent from '../../../components/DrawerComponent';

const imagesData = [
  { imagePath: 'image1', imageType: 'Nature', name: 'Ivan', description: 'Prosto snimka snimka', likes: 23, date: new Date() },
  { imagePath: 'image2', imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131, date: new Date(2024, 9, 23) },
  { imagePath: 'image3', imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13, date: new Date(2024, 5, 23) },
];

const GroupScreen: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  const [groupMember, setGroupMember] = useState(false);
  const [visibleImages, setVisibleImages] = useState(imagesData.slice(0, 10));
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
  }, [loading, visibleImages.length]);

  return (
    <Box display="flex">
      <DrawerComponent />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {groupMember ? (
          visibleImages.map((image, index) => (
            <Typography key={index}>{image.description}</Typography>
          ))
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="80vh">
            <Typography variant="h6" fontSize={36}>
              You must join this group to view its photos
            </Typography>
            <Button variant="contained" style={{ color: 'red', backgroundColor: 'yellow' }} onClick={() => setGroupMember(true)}>
              Join Group
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GroupScreen;
