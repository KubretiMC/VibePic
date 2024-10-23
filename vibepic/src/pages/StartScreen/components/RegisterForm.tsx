import React, { useState } from 'react';
import { Box, Button, Link, TextField, Typography } from '@mui/material';
import '../StartScreen.css';

interface RegisterFormProps {
    setIsLoginModalOpen: (isLoginModalOpen: boolean) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ setIsLoginModalOpen }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  return (
    <Box className="modal">
        <Typography style={{fontSize: '22px'}}>Registration</Typography>
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
            label="Email"
            type='email'
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            slotProps={{
                input: {
                style: { color: 'white' },
                },
                inputLabel: {
                style: { color: 'white' },
                },
            }}
        />

        <Button variant="contained" onClick={() => ''} style={{ marginTop: '16px' }}>Register</Button>
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
