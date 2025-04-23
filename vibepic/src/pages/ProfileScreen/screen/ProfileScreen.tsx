import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Tabs, 
  Tab, 
  Grid2, 
  Drawer
} from '@mui/material';
import { User } from '../../../models/User';
import { useNavigate } from 'react-router-dom';
import { Image } from '../../../models/Image';
import { Group } from '../../../models/Group';
import AvatarUploader from '../components/AvatarUploader';
import AddPhotoDialog from '../components/AddPhotoDialog';
import SelectedImageDialog from '../components/SelectedImageDialog';
import useBreakpoints from '../../../hooks/useBreakpoints';
import LoadingComponent from '../../../components/LoadingComponent';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { api } from '../../../api/api';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useBreakpoints();
  const [activeTab, setActiveTab] = useState(0);
  const [images, setImages] = useState<Image[]>([]);
  const [user, setUser] = useState<User>();
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [groupInfo, setGroupInfo] = useState<Group[]>([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    tempImage: null as File | null,
    tempImageUrl: '',
    imageDescription: '',
    selectedGroup: '',
  });

  const handleAddImageClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        tempImage: file,
        tempImageUrl: URL.createObjectURL(file),
      }));
      setOpenUploadDialog(true);
      e.target.value = '';
    }
  };

  const handleImageUploadSuccess = (newImage: Image) => {
    setImages((prevImages) => [newImage, ...prevImages]);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/users/loggedUser');
        setUser(response.data);
      
        const language = response.data.language;
        if (language) {
          i18n.changeLanguage(language);
        }
      } catch (error) {
        console.error('Error fetching personal images:', error);
      } finally {
        setIsLoading(false);
      }      
    };

    const getGroupNames = async () => {
      try {
        const response = await api.get('/groups/main-info');
        setGroupInfo(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    getUserInfo();
    getGroupNames();
  }, []);

  useEffect(() => {
    const fetchImagesByUploader = async () => {
      try {
        setIsLoading(true);
        
        const response = await api.get('/images/by-uploader');
      
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching personal images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchLikedImages = async () => {
      try {
        setIsLoading(true);        
        const response = await api.get('/images/liked-by-user');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching liked images:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if(activeTab === 0) {
      fetchImagesByUploader();
    } else {
      fetchLikedImages();
    }
  }, [activeTab]);

  
  const handleDeleteImage = async (image: Image) => {
    try {
      setIsLoading(true);
      await api.delete(`/images/${image.id}`);
      setImages((prevImages) => prevImages.filter((img) => img.id !== image.id));
      setSelectedImage(null);
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const unlikeImage = async (image: Image) => {
    try {
      setIsLoading(true);
    
      await api.post('/likes/unlike', {
        imageId: image.id,
      });
    
      setImages((prevImages) => prevImages.filter((img) => img.id !== image.id));
    } catch (error) {
      console.error('Error unliking the image:', error);
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
    }    
  };
  
  return (
    <Box display="flex">
      {!isSmallScreen ?
        <Drawer
            variant="permanent"
            sx={{
              width: isLargeScreen ? 240 : isMediumScreen ? 200 : 120,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: isLargeScreen ? 240 : isMediumScreen ? 200 : 160,
                boxSizing: 'border-box',
                backgroundColor: '#00A2E8'
              }
            }}
          >
            <Button
              onClick={() => navigate(`/home`)}
              sx={{
                  paddingLeft: 4,
                  paddingTop: 3,
                  textTransform: 'none',
                  display: 'block',
              }}
            >
              <Typography sx={{fontSize: isLargeScreen ? 24 : isMediumScreen ? 20 : 16, color: 'white', textAlign:'left'}}>
                  {t('HOME')}
              </Typography>
            </Button>
        </Drawer>
        :
        <Box 
          sx={{ 
            backgroundColor: '#00A2E8',
            position: 'fixed', 
            width: '100%',
            bottom: 0,
            zIndex: 1,
            border: 0
          }}
        >
          <Button variant="text" sx={{ fontSize: 24, color: 'white' }} onClick={() => navigate(`/home`)}>{t('HOME')}</Button>
        </Box>
      }
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 10 }}>
          <Typography variant="h4" fontWeight="bold">
            {user?.username}
          </Typography>
          <AvatarUploader
            userAvatarUrl={user?.avatarUrl}
            onAvatarUpdate={(newAvatarUrl) => {
              if (user) {
                setUser({ ...user, avatarUrl: newAvatarUrl });
              }
            }}
            setIsLoading={setIsLoading}
          />
        </Box>
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label={t('YOUR_IMAGES')} />
            <Tab label={t('YOUR_LIKES')} />
          </Tabs>
        </Box>

        <Box sx={{ marginTop: 4,  marginBottom: isSmallScreen ? 10 : 2, width: '80%' }}>
          <Grid2 container spacing={2} justifyContent={images.length === 0 ? "center" : "flex-start"}>
          {isLoading ? (
            <LoadingComponent />
          ) : 
            <>
              {activeTab === 0 &&
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <label
                    htmlFor="file-upload"
                    style={{ position: 'relative', cursor: 'pointer' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '200px',
                        border: '2px dashed #ccc',
                        borderRadius: '8px',
                        textAlign: 'center',
                        backgroundColor: '#fff',
                        transition: 'all 0.3s',
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                          borderColor: '#00A2E8',
                        },
                      }}
                    >
                      <Typography variant="h4" sx={{ color: '#000', fontWeight: 'bold', fontSize: '2rem' }}>
                        + {t('ADD_PHOTO')}
                      </Typography>
                    </Box>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleAddImageClick}
                    />
                  </label>
                </Grid2>
              }
              {activeTab === 1 && images.length === 0 ? 
                <>
                <Typography fontSize={40}>No images liked</Typography>
                </>
                :
                images.map((image) => (
                  <Grid2 key={image.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box
                      component="img"
                      src={image.imagePath}
                      alt={image.description}
                      sx={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: 2,
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedImage(image)}
                    />
                  </Grid2>
                ))
              }
            </>
          }
          </Grid2>
        </Box>

        <SelectedImageDialog
          selectedImage={selectedImage}
          deleteButtonText={activeTab === 0 ? t('DELETE') : t('UNLIKE')}
          onClose={() => setSelectedImage(null)}
          onDelete={activeTab === 0 ? handleDeleteImage : unlikeImage}
        />

        <AddPhotoDialog
          open={openUploadDialog}
          onClose={() => setOpenUploadDialog(false)}
          groupInfo={groupInfo}
          onImageUploadSuccess={handleImageUploadSuccess}
          formData={formData}
          setFormData={setFormData}
          setIsLoading={setIsLoading}
        />
      </Box>
      <LanguageSwitcher />
    </Box>
  );
};

export default ProfileScreen;
