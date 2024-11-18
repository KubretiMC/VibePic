import React, { useEffect, useState } from 'react';
import { Box, Button, Drawer, Typography } from '@mui/material';
import Category from './Category';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface Group {
  id: number;
  name: string;
}

const DrawerComponent: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
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

  const handleGroupClick = (groupName: string) => {
    navigate(`/groups/${groupName.toLowerCase()}`);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 220, boxSizing: 'border-box', backgroundColor: '#00A2E8' },
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
        <Category categoryName="Groups" items={groups.map(group => group.name)} onItemClick={handleGroupClick} selectedProp={groupName} />
        <Category categoryName="Time" items={["This week", "Last week", "Week Before Last"]} />
        <Category categoryName="Popularity" items={["Most liked images", "Most liked users"]} />
      </Box>
    </Drawer>
  );
};

export default DrawerComponent;
