import React, { useState } from 'react';
import { Box, Button, Link, TextField, Typography } from '@mui/material';
import '../screen/StartScreen.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LoginFormProps {
    setIsLoginModalOpen: (isLoginModalOpen: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setIsLoginModalOpen }) => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
        username,
        password,
      });
    
      const { token } = response.data;
    
      localStorage.setItem('token', token);
      navigate('/home');
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
      <Typography style={{ fontSize: '22px' }}>Welcome to VibePic</Typography>
      
      {errorMessage && (
          <Typography style={{ color: 'red', marginBottom: '8px' }}>
            {errorMessage}
          </Typography>
      )}
      
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        slotProps={{
            input: {
                style: { color: 'white' },
            },
            inputLabel: {
                style: { color: 'white' },
            },
        }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        slotProps={{
            input: {
                style: { color: 'white' },
            },
            inputLabel: {
                style: { color: 'white' },
            },
        }}
      />
      <Button variant="contained" onClick={handleLogin} style={{ marginTop: '16px' }}>
        Login
      </Button>
      <Typography variant="body2" style={{ marginTop: '16px', color: 'white' }}>
        Don’t have an account?{' '}
        <Link component="button" onClick={() => setIsLoginModalOpen(false)} style={{ color: 'white' }}>
          Register
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;
