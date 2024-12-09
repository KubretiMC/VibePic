import React, { useState } from 'react';
import { Box, Button, Link, TextField, Typography, Alert } from '@mui/material';
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
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        username,
        password,
      });
    
      const { token } = response.data;
    
      localStorage.setItem('token', token);
      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box className="modal">
      <Typography style={{ fontSize: '22px' }}>Welcome to VibePic</Typography>
      
      {error && <Alert severity="error" style={{ marginBottom: '16px' }}>{error}</Alert>}
      
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
