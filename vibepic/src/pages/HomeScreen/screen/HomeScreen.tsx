import React from 'react';
import { Drawer, Typography, Box } from '@mui/material';
import Category from '../components/Category';

const HomeScreen: React.FC = () => {
  return (
    <Box display="flex">
      <Drawer
        variant="permanent"
        anchor="left"
        color='red'
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 200, boxSizing: 'border-box', backgroundColor:'#00A2E8' },
        }}
      >
        <Box p={2} role="presentation">
          <Category categoryName='Category' items={["Animals", "Nature", "Travel", "Art"]} />
          <Category categoryName='Time' items={["This week", "Last 2 weeks", "Last month", "All time"]} />
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h1">Welcome to VibePic!</Typography>
        <Typography>Explore and upvote images from around the world.</Typography>
      </Box>
    </Box>
  );
};

export default HomeScreen;
