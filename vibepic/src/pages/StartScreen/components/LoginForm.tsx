import React, { useState } from 'react';
import { Box, Button, Link, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface LoginFormProps {
    setIsLoginModalOpen: (isLoginModalOpen: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setIsLoginModalOpen, setIsLoading }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
        username,
        password,
      }).finally(() => {
        setIsLoading(false);
      });
    
      const { token } = response.data;
    
      localStorage.setItem('token', token);
      navigate('/home');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || 'REGISTRATION_FAILED');
      } else {
        setErrorMessage('ERROR_OCCURED');
      }
    }
  };

  return (
    <Box
      sx={{
        width: '90%',
        maxWidth: '300px',
        margin: 'auto',
        marginTop: '15%',
        padding: '16px',
        backgroundColor: '#00A2E8',
        boxShadow: '24px 24px 32px rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
      }}
    >
      <Typography sx={{ fontSize: '22px' }}>{t('WELCOME_TO')} VibePic</Typography>
      
      {errorMessage && (
          <Typography sx={{ color: 'red', marginBottom: '8px' }}>
            {t(errorMessage)}
          </Typography>
      )}
      
      <TextField
        label={t('USERNAME')}
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        slotProps={{
            input: {
                sx: { color: 'white' },
            },
            inputLabel: {
                sx: { color: 'white' },
            },
        }}
      />
      <TextField
        label={t('PASSWORD')}
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        slotProps={{
            input: {
                sx: { color: 'white' },
            },
            inputLabel: {
                sx: { color: 'white' },
            },
        }}
      />
      <Button variant="contained" onClick={handleLogin} sx={{ marginTop: '16px' }}>
        {t('LOGIN')}
      </Button>
      <Typography variant="body2" sx={{ marginTop: '16px', color: 'white' }}>
        {t('DONT_HAVE_ACCOUNT')}{' '}
        <Link component="button" onClick={() => setIsLoginModalOpen(false)} sx={{ color: 'white' }}>
          {t('REGISTER')}
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;
