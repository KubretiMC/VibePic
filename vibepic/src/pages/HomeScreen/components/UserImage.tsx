import React, { useEffect, useState } from 'react';
import { Box, Button, Grid2, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { Image } from '../../../models/Image';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface UserImageProps {
  image: Image;
  liked: boolean;
  authToken: string;
}

const UserImage: React.FC<UserImageProps> = ({ image, liked: initialLiked, authToken }) => {
  const { t, i18n } = useTranslation();
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
  
  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(image.createdAt));

  return (
    <Grid2 container spacing={2}>
    <Box 
      component="main" 
      sx={{ 
        flex: 1, 
        p: 3, 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          flex: 2,
          maxWidth: '60%',
          overflow: 'hidden',
          boxShadow: 1,
        }}
      >
        <Box
          component="img"
          src={image.imagePath}
          alt={image.description}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>
  
      <Box
        sx={{
          flex: 1,
          textAlign: 'left',
          border: '1px solid #ddd',
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 2,
          height: 'auto',
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: 1 }}>
            <Box sx={{ width: '100%', marginTop: 0.5 }}>
              {image.groupName &&
                <Typography
                  sx={{
                    bgcolor: 'orange',
                    paddingX: 2,
                    paddingY: 0.5,
                    marginBottom: 1,
                    borderRadius: 2,
                    fontSize: 14,
                    color: 'white',
                    display: 'inline-block',
                  }}
                >
                  {t(image.groupName)}
                </Typography>
              }
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: '1 1 auto' }}>
              <Typography
                fontWeight="bold"
                fontSize={20}
                sx={{
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  maxWidth: '100%',
                }}
              >
                {image.uploaderName}
              </Typography>

              {image.uploaderAvatar ? (
               <Box
                  component="img"
                  src={image.uploaderAvatar}
                  alt="Uploader Avatar"
                  sx={{
                    width: '30px',
                    height: '30px',
                    marginLeft: 2,
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <AccountCircleIcon sx={{ color: 'red', marginLeft: 1, fontSize: 32 }} />
              )}
            </Box>
          </Box>

          <Typography sx={{ wordWrap: 'break-word' }} variant="body2" marginBottom={1}>
            {image.description}
          </Typography>

          <Typography fontSize={12} variant="body2">
            {formattedDate}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
          <Typography variant="caption" fontWeight="bold" fontSize={16}>
            {t('LIKES')} {likes}
          </Typography>
          {liked ? (
            <Button
              onClick={unlikeImage}
              sx={{ padding: 0, minWidth: 'auto' }}
            >
              <FavoriteIcon sx={{ color: 'red', fontSize: '20px', display: 'block', paddingLeft: 1 }} />
            </Button>
          ) : (
            <Button
              onClick={likeImage}
              sx={{  padding: 0, minWidth: 'auto' }}
            >
              <FavoriteBorderOutlinedIcon  sx={{ fontSize: '20px', display: 'block', paddingLeft: 1  }} color={'disabled'}  />
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  </Grid2>
  );
};

export default UserImage;
