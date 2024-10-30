import React, { useState } from 'react';
import { Box, Button, Grid2, Typography } from '@mui/material';
import AccountCircleIcon  from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

interface UserImageProps {
    name: string;
    imageType: string;
    description: string;
    likes: number;
    imagePath: string;
}

const UserImage: React.FC<UserImageProps> = ({ name, imageType, description, likes, imagePath }) => {
  const [liked, setLiked] = useState(false);
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs:12,  md:4 }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex' }}>
          <Box sx={{ flexShrink: 0, width: 800, height: 400, border: 1 }}>
            <img 
              src={imagePath} 
              alt="VibePic Image"
              style={{ width: 800, height: 400 }}
            />
          </Box>
    
          <Box sx={{ flexGrow: 1, textAlign: 'left', border: 1, paddingLeft: 2 }}>    
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '200px', height: '100%' }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', marginY: 1 }}>
                  <Typography fontWeight={"bold"} variant="body2">{name}</Typography>
                  <AccountCircleIcon sx={{ color: 'red', marginLeft: 1, marginRight: 2 }} />
                  <Typography fontStyle={{color: 'white'}} bgcolor={"orange"} paddingX={2} paddingY={0.2} borderRadius={2} variant="body2">{imageType}</Typography>
                </Box>
                <Typography variant="body2">{description}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                <Typography variant="caption" fontWeight={"bold"} fontSize={18}>Likes: {liked ? likes + 1 : likes}</Typography>
                {liked ?
                  <Button  onClick={() => setLiked(false)}  style={{paddingLeft: 0,  boxShadow: 'none', outline: 'none'}}>
                    <FavoriteIcon sx={{ color: 'red', marginLeft: 1, marginRight: 2 }} />
                  </Button>
                  :
                  <Button onClick={() => setLiked(true)} style={{paddingLeft: 0,  boxShadow: 'none',  outline: 'none' }}>
                    <FavoriteBorderOutlinedIcon sx={{ marginLeft: 1, marginRight: 2 }} color='disabled' />
                  </Button>  
                }
              </Box>
            </Box>
          </Box>

        </Box>
      </Grid2>
    </Grid2>
  );
};

export default UserImage;
