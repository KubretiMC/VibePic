import React, { useState } from 'react';
import { Box, Button, Link, TextField, Typography } from '@mui/material';
import '../StartScreen.css';

interface LoginFormProps {
    setIsLoginModalOpen: (isLoginModalOpen: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setIsLoginModalOpen }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Box className="modal">
        <Typography style={{fontSize: '22px'}}>Welcome to VibePic</Typography>
        <TextField
        label="Username"
        variant="outlined"
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
        variant="outlined"
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

        <Button variant="contained" onClick={() => ''} style={{ marginTop: '16px' }}>Login</Button>
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
