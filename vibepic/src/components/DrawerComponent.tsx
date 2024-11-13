import React, { useEffect, useState } from 'react';
import { Box, Drawer } from '@mui/material';
import Category from './Category';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Group {
  id: number;
  name: string;
}

const DrawerComponent: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:3001/groups');
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupClick = async (groupName: string) => {
    const group = groups.find(g => g.name === groupName);
    if (!group) return;
  
    try {
      const response = await axios.get(`http://localhost:3001/groups/${group.id}/is-member`, {
        params: { userId: 1 },
      });
 
      if (response.data.isMember) {
        navigate(`/groups/${groupName}`); 
      } else {
        await axios.post(`http://localhost:3001/groups/${group.id}/join`, {
          userId: 1
        });
  
        alert('You have successfully joined the group!');
        navigate(`/groups/${groupName}`);
      }
    } catch (error) {
      console.error('Error checking group membership or joining the group:', error);
    }
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 220, boxSizing: 'border-box', backgroundColor: '#00A2E8' },
      }}
    >
      <Box p={2} role="presentation">
        <Category categoryName="Groups" items={groups.map(group => group.name)} onItemClick={handleGroupClick} />
        <Category categoryName="Time" items={["This week", "Last 2 weeks", "Last month", "All time"]} />
        <Category categoryName="Popularity" items={["Most liked images", "Most liked users"]} />
      </Box>
    </Drawer>
  );
};

export default DrawerComponent;
