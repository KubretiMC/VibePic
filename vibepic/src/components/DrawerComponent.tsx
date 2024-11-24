import React, { useEffect, useState } from 'react';
import { Box, Button, Drawer, Typography } from '@mui/material';
import Category from './Category';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

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
}

const DrawerComponent: React.FC<DrawerComponentProps> = ({ dateFilter, updateDateFilter }) => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<string[]>([]);
  const { groupName = '' } = useParams<{ groupName: string }>();
  
  useEffect(() => {
    axios.get('http://localhost:3001/groups/names')
      .then(response => {
        setGroups(response.data);
      })
      .catch(error => {
        console.error('Error fetching groups:', error);
      });
  }, []);

  const handleGroupClick = (group: string) => {
    if(groupName ===  group.toLowerCase()) {
      navigate('/home');
    } else {
      navigate(`/groups/${group.toLowerCase()}`);
    }
  };

  const getKeyFromValue = (value: string) => {
    return (Object.keys(timeFilterDisplayNames) as Array<keyof typeof timeFilterDisplayNames>)
      .find(key => timeFilterDisplayNames[key] === value);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', backgroundColor: '#00A2E8' },
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
            <Typography style={{fontSize: 24, color: 'white'}}>
                Home
            </Typography>
        </Button>
        <Category 
          categoryName="Groups" 
          items={groups} 
          onItemClick={handleGroupClick} 
          selectedProp={groupName} 
        />
        <Category 
          categoryName="Time" 
          items={Object.keys(timeFilterDisplayNames)} 
          onItemClick={(item) => updateDateFilter(timeFilterDisplayNames[item as 'This Week' | 'Last Week' | 'Week Before Last'])} 
          selectedProp={getKeyFromValue(dateFilter)} 
        />
        <Category 
          categoryName="Popularity" 
          items={["Most liked images", "Most liked users"]} 
        />
      </Box>
    </Drawer>
  );
};

export default DrawerComponent;
