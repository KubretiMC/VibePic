import React, { useEffect, useState } from 'react';
import { Box, Button, Grid2, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { Image } from '../../../models/Image';
import axios from 'axios';
import useBreakpoints from '../../../hooks/useBreakpoints';

interface UserImageProps {
  image: Image;
  liked: boolean;
  authToken: string;
}

const UserImage: React.FC<UserImageProps> = ({ image, liked: initialLiked, authToken }) => {
  const { isLargeScreen, isMediumScreen, isSmallScreen, isVerySmallScreen } = useBreakpoints();
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(image.likes);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  const likeImage = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/likes/like`, {
        imageId: image.id,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setLiked(true);
      setLikes(likes + 1);
    } catch (error) {
      console.error('Error liking the image:', error);
    }
  };

  const unlikeImage = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/likes/unlike`, {
        imageId: image.id,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setLiked(false);
      setLikes(likes - 1);
    } catch (error) {
      console.error('Error unliking the image:', error);
    }
  };

  return (
    <Grid2 container spacing={2}>
        <Box component="main" sx={{ flex: 1, p: 3, display: 'flex' }}>
        <Grid2 sx={{ width: isLargeScreen ? '90%' : '80%' }}>
          <Box
            component="img"
            src={image.imagePath}
            alt={image.description}
            sx={{
              width: '100%',
              height: '100%',
              maxHeight: isLargeScreen ? '400px' : isMediumScreen ? '350px' : isSmallScreen ? '300px' : '250px',
            }}
          />
        </Grid2>
        <Grid2 sx={{ textAlign: 'left', border: 1, paddingLeft: 2, height: isLargeScreen ? '400px' : isMediumScreen ? '350px' : isSmallScreen ? '300px' : '250px' }}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between', 
                width: isLargeScreen ? '220px' : '140px', 
                height: '100%', 
                paddingRight: isVerySmallScreen ? 0 : isLargeScreen ? 8 : isMediumScreen ?  2 : 8,
              }}>
              <Box sx={{paddingRight: isVerySmallScreen ? 5 : 0}}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginY: 1 }}>
                  <Typography fontWeight={"bold"} fontSize={isVerySmallScreen ? 14 : 26} variant="body2">{image.uploaderName}</Typography>
                  {image.uploaderAvatar ? 
                    <img
                      style={{ width: isVerySmallScreen ? '20px' : '30px', height: isVerySmallScreen ? '20px' : '30px', marginLeft: 5, borderRadius: 50 }}
                      src={image.uploaderAvatar}
                      alt="Current Avatar"
                    />
                    :
                    <AccountCircleIcon sx={{ color: 'red', marginLeft: 1, marginRight: 2,  fontSize: isVerySmallScreen ? 24 : 40 }} />
                  }
                  {isLargeScreen &&
                    <Typography fontStyle={{ color: 'white' }} bgcolor={"orange"} paddingX={2} paddingY={0.2} borderRadius={2} variant="body2">{image.groupName}</Typography>
                  }
                </Box>
                {!isLargeScreen &&
                <Typography fontStyle={{ color: 'white' }} width={40} bgcolor={"orange"} paddingX={2} paddingY={0.2} borderRadius={2} variant="body2">{image.groupName}</Typography>
                }
                <Typography style={{ wordWrap: 'break-word'}} variant="body2">{image.description}</Typography>
                <Typography fontSize={12} variant="body2">{new Date(image.createdAt).toDateString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                <Typography variant="caption" fontWeight={"bold"} fontSize={16}>Likes: {likes}</Typography>
                {liked ? (
                  <Button onClick={unlikeImage} style={{ paddingLeft: 0, boxShadow: 'none', outline: 'none' }}>
                    <FavoriteIcon sx={{ color: 'red', marginLeft: 1, marginRight: 4 }} />
                  </Button>
                ) : (
                  <Button onClick={likeImage} style={{ paddingLeft: 0, boxShadow: 'none', outline: 'none' }}>
                    <FavoriteBorderOutlinedIcon sx={{ marginLeft: 1, marginRight: 4 }} color='disabled' />
                  </Button>
                )}
              </Box>
            </Box>
        </Grid2>
        </Box>
    </Grid2>
  );
};

export default UserImage;
