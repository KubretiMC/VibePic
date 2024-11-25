import React, { useState } from 'react';
import { Button, Typography, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

const UserDropdown: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const userName = 'mariqn';

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    handleMenuClose();
  };

  return (
    <>
      <Button
        sx={{ position: 'absolute', top: 16, right: 16, display: 'flex' }}
        onClick={handleMenuOpen}
      >
        <Typography fontWeight="bold" color="black" variant="body2">
          {userName}
        </Typography>
        <AccountCircleIcon sx={{ color: 'red', marginLeft: 1, marginRight: 2 }} />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserDropdown;
