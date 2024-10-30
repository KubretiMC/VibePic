import React, { useState, useEffect } from 'react';
import { Drawer, Box } from '@mui/material';
import Category from '../components/Category';
import image1 from '../../../images/image-1.png';
import image2 from '../../../images/image-2.png';
import image3 from '../../../images/image-3.png';
import UserImage from '../components/UserImage';

const imagesData = [
  { imagePath: image1, imageType: 'Nature', name: 'Ivan', description: 'Prosto snimka snimka', likes: 23 },
  { imagePath: image2, imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131 },
  { imagePath: image3, imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13 },
  { imagePath: image1, imageType: 'Nature', name: 'Ivan', description: 'Prosto snimka snimka', likes: 23 },
  { imagePath: image2, imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131 },
  { imagePath: image3, imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13 },
  { imagePath: image1, imageType: 'Nature', name: 'Ivan', description: 'Prosto snimka snimka', likes: 23 },
  { imagePath: image2, imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131 },
  { imagePath: image3, imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13 },
  { imagePath: image1, imageType: 'Nature', name: 'Ivan', description: 'Prosto snimka snimka', likes: 23 },
  { imagePath: image2, imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131 },
  { imagePath: image3, imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13 },
  { imagePath: image1, imageType: 'Nature', name: 'Ivan', description: 'Prosto snimka snimka', likes: 23 },
  { imagePath: image2, imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131 },
  { imagePath: image3, imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13 },
  { imagePath: image1, imageType: 'Nature', name: 'Ivan', description: 'Prosto snimka snimka', likes: 23 },
  { imagePath: image2, imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131 },
  { imagePath: image3, imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13 },
  { imagePath: image1, imageType: 'Nature', name: 'Ivan', description: 'Prosto snimka snimka', likes: 23 },
  { imagePath: image2, imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131 },
  { imagePath: image3, imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13 },
  { imagePath: image1, imageType: 'Nature', name: 'Ivan', description: 'Prosto snimka snimka', likes: 23 },
  { imagePath: image2, imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131 },
  { imagePath: image3, imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13 },
  { imagePath: image2, imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131 },
  { imagePath: image3, imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13 },
  { imagePath: image1, imageType: 'Nature', name: 'Ivan', description: 'Prosto snimka snimka', likes: 23 },
  { imagePath: image2, imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131 },
  { imagePath: image3, imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13 },
  { imagePath: image1, imageType: 'Nature', name: 'Ivan', description: 'Prosto snimka snimka', likes: 23 },
  { imagePath: image2, imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131 },
  { imagePath: image3, imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13 },
  { imagePath: image2, imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131 },
  { imagePath: image3, imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13 },
  { imagePath: image1, imageType: 'Nature', name: 'Ivan', description: 'Prosto snimka snimka', likes: 23 },
  { imagePath: image2, imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131 },
  { imagePath: image3, imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13 },
  { imagePath: image1, imageType: 'Nature', name: 'Ivan', description: 'Prosto snimka snimka', likes: 23 },
  { imagePath: image2, imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131 },
  { imagePath: image3, imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13 },
  { imagePath: image2, imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131 },
  { imagePath: image3, imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13 },
  { imagePath: image2, imageType: 'Art', name: 'Gabi', description: 'Mnogo podrobno opisanie', likes: 131 },
  { imagePath: image3, imageType: 'City', name: 'Todor', description: 'Lqlqlqlq', likes: 13 },
];

const HomeScreen: React.FC = () => {
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
        {visibleImages.map((image, index) => (
          <UserImage key={index} {...image} />
        ))}
      </Box>
    </Box>
  );
};

export default HomeScreen;
