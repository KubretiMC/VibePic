import React, { useEffect, useState } from 'react';
import { Box, Button, Grid2, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { Image } from '../../../models/Image';
import axios from 'axios';

interface UserImageProps {
  image: Image;
  liked: boolean;
  authToken: string;
}

const UserImage: React.FC<UserImageProps> = ({ image, liked: initialLiked, authToken }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(image.likes);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  const likeImage = async () => {
    try {
      await axios.post('http://localhost:3001/likes/like', {
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
      await axios.post('http://localhost:3001/likes/unlike', {
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
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex' }}>
          <Box sx={{ flexShrink: 0, width: 800, height: 400, border: 1 }}>
            <img
              src={image.imagePath}
              alt="VibePic"
              style={{ width: 800, height: 400 }}
            />
          </Box>

          <Box sx={{ flexGrow: 1, textAlign: 'left', border: 1, paddingLeft: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '220px', height: '100%', paddingRight: 1 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', marginY: 1 }}>
                  <Typography fontWeight={"bold"} variant="body2">{image.uploaderName}</Typography>
                  <AccountCircleIcon sx={{ color: 'red', marginLeft: 1, marginRight: 2 }} />
                  <Typography fontStyle={{ color: 'white' }} bgcolor={"orange"} paddingX={2} paddingY={0.2} borderRadius={2} variant="body2">{image.groupName}</Typography>
                </Box>
                <Typography variant="body2">{image.description}</Typography>
                <Typography fontSize={12} variant="body2">{new Date(image.createdAt).toDateString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                <Typography variant="caption" fontWeight={"bold"} fontSize={18}>Likes: {likes}</Typography>
                {liked ? (
                  <Button onClick={unlikeImage} style={{ paddingLeft: 0, boxShadow: 'none', outline: 'none' }}>
                    <FavoriteIcon sx={{ color: 'red', marginLeft: 1, marginRight: 2 }} />
                  </Button>
                ) : (
                  <Button onClick={likeImage} style={{ paddingLeft: 0, boxShadow: 'none', outline: 'none' }}>
                    <FavoriteBorderOutlinedIcon sx={{ marginLeft: 1, marginRight: 2 }} color='disabled' />
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid2>
    </Grid2>
  );
};

export default UserImage;
