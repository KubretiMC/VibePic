import React, { useEffect, useState } from 'react';
import { Box, Slide } from '@mui/material';
import './StartScreen.css';
import image1 from '../../../images/image-1.png';
import image2 from '../../../images/image-2.png';
import image3 from '../../../images/image-3.png';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from '../../../models/JwtPayload';

const StartScreen: React.FC = () => {
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);

  const getRandomImage = () => {
    const images = [image1, image2, image3];
    return images[Math.floor(Math.random() * images.length)];
  };

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { exp } = jwtDecode<JwtPayload>(token);
          if (exp * 1000 > Date.now()) {
            navigate('/home');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    };
    checkToken();

    const randomImage = getRandomImage();
    setBackgroundImage(randomImage);
  }, [])

  return (
    <Box className="container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Slide direction="down" in={true} mountOnEnter unmountOnExit timeout={2000}>
        <Box>
          {isLoginModalOpen ? 
            <LoginForm setIsLoginModalOpen={setIsLoginModalOpen} /> :
            <RegisterForm setIsLoginModalOpen={setIsLoginModalOpen} />
          }
        </Box>
      </Slide>
    </Box>
  );
};

export default StartScreen;
