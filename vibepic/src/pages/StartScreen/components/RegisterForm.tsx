import React, { useState } from 'react';
import { Box, Button, Link, TextField, Typography } from '@mui/material';
import '../screen/StartScreen.css';
import axios from 'axios';

interface RegisterFormProps {
    setIsLoginModalOpen: (isLoginModalOpen: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    setNotificaitonText: (notificationText: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ setIsLoginModalOpen, setIsLoading, setNotificaitonText }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    if (password !== passwordConfirm) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, {
        username,
        email,
        password,
      }).then(() => {
        setNotificaitonText('Successfully registered!')
        setIsLoginModalOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || 'Registration failed');
      } else {
        setErrorMessage('An error occurred');
      }
    }
  };

  return (
    <Box className="modal">
        <Typography style={{fontSize: '22px'}}>Registration</Typography>
        
        {errorMessage && (
          <Typography style={{ color: 'red', marginBottom: '8px' }}>
            {errorMessage}
          </Typography>
        )}

        <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            slotProps={{
                input: { style: { color: 'white' } },
                inputLabel: { style: { color: 'white' } },
            }}
        />
        <TextField
            label="Email"
            type='email'
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            slotProps={{
                input: { style: { color: 'white' } },
                inputLabel: { style: { color: 'white' } },
            }}
        />
        <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
                input: { style: { color: 'white' } },
                inputLabel: { style: { color: 'white' } },
            }}
        />
        <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            slotProps={{
                input: { style: { color: 'white' } },
                inputLabel: { style: { color: 'white' } },
            }}
        />

        <Button variant="contained" onClick={handleRegister} style={{ marginTop: '16px' }}>
            Register
        </Button>
        
        <Typography variant="body2" style={{ marginTop: '16px', color: 'white' }}>
            Already have an account?{' '}
            <Link component="button" onClick={() => setIsLoginModalOpen(true)} style={{ color: 'white' }}>
                Login
            </Link>
        </Typography>
    </Box>
  );
};

export default RegisterForm;
