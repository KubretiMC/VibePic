import React, { useEffect, useState } from 'react';
import { Box, Slide } from '@mui/material';
import image1 from '../../../images/image-1.png';
import image2 from '../../../images/image-2.png';
import image3 from '../../../images/image-3.png';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from '../../../models/JwtPayload';
import LoadingComponent from '../../../components/LoadingComponent';
import NotificationComponent from '../../../components/NotificationComponent';

const StartScreen: React.FC = () => {
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationText, setNotificaitonText] = useState('');

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
  }, [navigate ])

  return (
    <Box 
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
      }}
    >
      <Slide direction="down" in={true} mountOnEnter unmountOnExit timeout={2000}>
        <Box>
          {isLoginModalOpen ? 
            <LoginForm setIsLoginModalOpen={setIsLoginModalOpen} setIsLoading={setIsLoading} /> :
            <RegisterForm setIsLoginModalOpen={setIsLoginModalOpen} setIsLoading={setIsLoading} setNotificaitonText={setNotificaitonText} />
          }
        </Box>
      </Slide>
      {isLoading && (
        <LoadingComponent />
      )}
      <NotificationComponent notificationText={notificationText} setNotificationText={setNotificaitonText}/>
    </Box>
  );
};

export default StartScreen;
