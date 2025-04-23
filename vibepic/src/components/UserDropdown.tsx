import React, { useEffect, useState } from 'react';
import { Button, Typography, Menu, MenuItem, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { User } from '../models/User';
import LoadingComponent from './LoadingComponent';
import { useTranslation } from 'react-i18next';
import { api } from '../api/api';

const UserDropdown: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setIsLoading] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<User>();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const getUserInfo = async () => {
    try {
      const response = await api.get('/users/loggedUser');
      setUser(response.data);

      const language = response.data.language;
      if (language) {
        i18n.changeLanguage(language);
      }
    } catch (error) {
      console.error('Error fetching personal images:', error);
    } finally {
      setIsLoading(false);
    }
    };
    getUserInfo();
  }, []);

  return (
    <>
      {loading ? 
        <LoadingComponent />
      :
      <Button
        sx={{ position: 'absolute', top: 16, right: 16, display: 'flex' }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <>
        <Typography fontWeight="bold" color="black" variant="body2">
          {user?.username}
        </Typography>
        {user?.avatarUrl ?
         <Box
            component="img"
            src={user.avatarUrl}
            alt="Current Avatar"
            sx={{
              width: '40px',
              height: '40px',
              marginLeft: 1,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          :
          <AccountCircleIcon sx={{ color: 'red', marginLeft: 1, marginRight: 2 }} />
        }
        </>
      </Button>
      }

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() =>   setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleProfileClick}>{t('PROFILE')}</MenuItem>
        <MenuItem onClick={handleLogoutClick}>{t('LOGOUT')}</MenuItem>
      </Menu>
    </>
  );
};

export default UserDropdown;
