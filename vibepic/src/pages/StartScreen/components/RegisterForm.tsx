import React, { useState } from 'react';
import { Box, Button, Link, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface RegisterFormProps {
    setIsLoginModalOpen: (isLoginModalOpen: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    setNotificaitonText: (notificationText: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ setIsLoginModalOpen, setIsLoading, setNotificaitonText }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    if (password !== passwordConfirm) {
      setErrorMessage(t('PASSWORD_NOT_MATCH'));
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, {
        username,
        email,
        password,
      }).then(() => {
        setNotificaitonText(t('SUCCESSFULLY_REGISTERED'))
        setIsLoginModalOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || t('REGISTRATION_FAILED'));
      } else {
        setErrorMessage(t('ERROR_OCCURED'));
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
        <Typography sx={{fontSize: '22px'}}>{t('REGISTRATION')}</Typography>
        
        {errorMessage && (
          <Typography sx={{ color: 'red', marginBottom: '8px' }}>
            {errorMessage}
          </Typography>
        )}

        <TextField
            label={t('USERNAME')}
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            slotProps={{
                input: { sx: { color: 'white' } },
                inputLabel: { sx: { color: 'white' } },
            }}
        />
        <TextField
            label={t('EMAIL')}
            type='email'
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            slotProps={{
                input: { sx: { color: 'white' } },
                inputLabel: { sx: { color: 'white' } },
            }}
        />
        <TextField
            label={t('PASSWORD')}
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
                input: { sx: { color: 'white' } },
                inputLabel: { sx: { color: 'white' } },
            }}
        />
        <TextField
            label={t('PASSWORD_CONFIRM')}
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            slotProps={{
                input: { sx: { color: 'white' } },
                inputLabel: { sx: { color: 'white' } },
            }}
        />

        <Button variant="contained" onClick={handleRegister} sx={{ marginTop: '16px' }}>
            {t('REGISTER')}
        </Button>
        
        <Typography variant="body2" sx={{ marginTop: '16px', color: 'white' }}>
            {t('ALREADY_HAVE_ACCOUNT')}{' '}
            <Link component="button" onClick={() => setIsLoginModalOpen(true)} sx={{ color: 'white' }}>
                {t('LOGIN')}
            </Link>
        </Typography>
    </Box>
  );
};

export default RegisterForm;
