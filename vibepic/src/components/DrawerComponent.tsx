import React, { useEffect, useState } from 'react';
import { Box, Button, Drawer, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Category from './Category';
import { useNavigate, useParams } from 'react-router-dom';
import useBreakpoints from '../hooks/useBreakpoints';
import { useTranslation } from 'react-i18next';
import { api } from '../api/api';

interface DrawerComponentProps {
  updateDateFilter: (dateFilter: string) => void;
  likedFilter: string;
  updateLikeFilter: (likeFilter: string) => void;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (isMobileDrawerOpen: boolean) => void;
  selectedWeekFilter: string;
  setSelectedWeekFilter: (selectedFilter: string) => void;
}

const DrawerComponent: React.FC<DrawerComponentProps> = ({ 
  likedFilter,
  updateDateFilter, 
  updateLikeFilter, 
  isMobileDrawerOpen, 
  setIsMobileDrawerOpen,
  selectedWeekFilter,
  setSelectedWeekFilter
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLargeScreen, isMediumScreen } = useBreakpoints();
  const [groups, setGroups] = useState<string[]>([]);
  const { groupName = '' } = useParams<{ groupName: string }>();

  useEffect(() => {
    const getGroupNames = async () => {
      try {
        const response = await api.get('/groups/names');
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    getGroupNames();
  }, []);

  const handleGroupClick = (group: string) => {
    if(groupName ===  group.toLowerCase()) {
      navigate('/home');
    } else {
      navigate(`/groups/${group.toLowerCase()}`);
    }
    setIsMobileDrawerOpen(false);
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
          backgroundColor: '#00A2E8',
        },
      }}
    >
      {isMobileDrawerOpen && (
        <IconButton
          onClick={() => setIsMobileDrawerOpen(false)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
          }}
        >
          <CloseIcon sx={{ fontSize: 36 }} />
        </IconButton>
      )}
      <Box p={2} role="presentation">
        <Button
          onClick={() => {
            setIsMobileDrawerOpen(false);
            navigate(`/home`)
          }}
          sx={{
              paddingLeft: 2,
              textTransform: 'none',
              display: 'block',
          }}
        >
            <Typography 
              sx={{
                fontSize: isMobileDrawerOpen ? 60 : isLargeScreen ? 24 : isMediumScreen ? 20 : 16, 
                color: 'white'
              }}>
                {t('HOME')}
            </Typography>
        </Button>
        <Category 
          categoryName={t('GROUPS')} 
          items={groups} 
          onItemClick={handleGroupClick} 
          isMobileDrawerOpen={isMobileDrawerOpen}
          selectedProp={groupName} 
        />
        <Category 
          categoryName={t('TIME')} 
          items={['THIS_WEEK', 'LAST_WEEK', 'WEEK_BEFORE_LAST']} 
          onItemClick={(item) => {
            if(item === selectedWeekFilter) {
              setSelectedWeekFilter('');
            } else {
              setSelectedWeekFilter(item);
            }
            updateDateFilter(item)
          }}
          isMobileDrawerOpen={isMobileDrawerOpen}
          selectedProp={selectedWeekFilter} 
        />
        <Category 
          categoryName={t('POPULARITY')} 
          items={[t('MOST_LIKED_IMAGES')]} 
          onItemClick={() => updateLikeFilter('images')}
          isMobileDrawerOpen={isMobileDrawerOpen}
          selectedProp={likedFilter && t('MOST_LIKED_IMAGES')} 
        />
      </Box>
    </Drawer>
  );
};

export default DrawerComponent;
