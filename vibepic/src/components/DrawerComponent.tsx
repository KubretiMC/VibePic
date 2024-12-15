import React, { useEffect, useState } from 'react';
import { Box, Button, Drawer, Typography } from '@mui/material';
import Category from './Category';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import useBreakpoints from '../hooks/useBreakpoints';

const timeFilterDisplayNames: {
  'This Week': string;
  'Last Week': string;
  'Week Before Last': string;
} = {
  'This Week': 'this',
  'Last Week': 'last',
  'Week Before Last': 'beforeLast',
};

interface DrawerComponentProps {
  dateFilter: string;
  updateDateFilter: (dateFilter: string) => void;
  likedFilter: string;
  updateLikeFilter: (likeFilter: string) => void;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (isMobileDrawerOpen: boolean) => void;
}

const DrawerComponent: React.FC<DrawerComponentProps> = ({ dateFilter, likedFilter, updateDateFilter, updateLikeFilter, isMobileDrawerOpen, setIsMobileDrawerOpen }) => {
  const authToken = localStorage.getItem('token'); 
  const navigate = useNavigate();
  const { isLargeScreen, isMediumScreen } = useBreakpoints();
  const [groups, setGroups] = useState<string[]>([]);
  const { groupName = '' } = useParams<{ groupName: string }>();
  
  useEffect(() => {
    const getGroupNames = async () => {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/groups/names`, {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      .then(response => {
        setGroups(response.data);
      })
      .catch(error => {
        console.error('Error fetching groups:', error);
      });
    };
    getGroupNames();
  }, [authToken]);

  const handleGroupClick = (group: string) => {
    if(groupName ===  group.toLowerCase()) {
      navigate('/home');
    } else {
      navigate(`/groups/${group.toLowerCase()}`);
    }
    setIsMobileDrawerOpen(false);
  };

  const getKeyFromValue = (value: string) => {
    return (Object.keys(timeFilterDisplayNames) as Array<keyof typeof timeFilterDisplayNames>)
      .find(key => timeFilterDisplayNames[key] === value);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isMobileDrawerOpen ? '100%' : isLargeScreen ? 240 : isMediumScreen ? 200 : 120,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isMobileDrawerOpen ? '100%' : isLargeScreen ? 240 : isMediumScreen ? 200 : 160,
          boxSizing: 'border-box',
          backgroundColor: '#00A2E8'
        }
      }}
    >
      <Box p={2} role="presentation">
        <Button
          onClick={() => navigate(`/home`)}
          sx={{
              paddingLeft: 2,
              textTransform: 'none',
              display: 'block',
          }}
        >
            <Typography style={{fontSize: isMobileDrawerOpen ? 60 : isLargeScreen ? 24 : isMediumScreen ? 20 : 16, color: 'white'}}>
                Home
            </Typography>
        </Button>
        <Category 
          categoryName="Groups" 
          items={groups} 
          onItemClick={handleGroupClick} 
          isMobileDrawerOpen={isMobileDrawerOpen}
          selectedProp={groupName} 
        />
        <Category 
          categoryName="Time" 
          items={Object.keys(timeFilterDisplayNames)} 
          onItemClick={(item) => updateDateFilter(timeFilterDisplayNames[item as 'This Week' | 'Last Week' | 'Week Before Last'])} 
          isMobileDrawerOpen={isMobileDrawerOpen}
          selectedProp={getKeyFromValue(dateFilter)} 
        />
        <Category 
          categoryName="Popularity" 
          items={["Most liked images"]} 
          onItemClick={() => updateLikeFilter('images')} 
          isMobileDrawerOpen={isMobileDrawerOpen}
          selectedProp={likedFilter && 'Most liked images'} 
        />
        {isMobileDrawerOpen &&
          <Button
            onClick={() => setIsMobileDrawerOpen(false)}
            sx={{
                paddingLeft: 2,
                textTransform: 'none',
                display: 'block',
            }}
          >
            <Typography style={{fontSize: isMobileDrawerOpen ? 60 : isLargeScreen ? 24 : isMediumScreen ? 20 : 16, color: 'white'}}>
                Close
            </Typography>
          </Button>
        }
      </Box>
    </Drawer>
  );
};

export default DrawerComponent;
