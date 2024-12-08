import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Tabs, 
  Tab, 
  Grid2, 
  Drawer, 
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { User } from '../../../models/User';
import { useNavigate } from 'react-router-dom';
import { Image } from '../../../models/Image';
import { Group } from '../../../models/Group';
import AvatarUploader from '../components/AvatarUploader';
import AddPhotoDialog from '../components/AddPhotoDialog';
import SelectedImageDialog from '../components/SelectedImageDialog';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
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
        const response = await axios.get(`http://localhost:3001/users/59995a1b-a2c6-11ef-aafe-8c1645e72e09`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching personal images:', error);
      }
    };

    const getGroupNames = async () => {
      await axios.get('http://localhost:3001/groups/main-info')
      .then(response => {
        setGroupInfo(response.data);
      })
      .catch(error => {
        console.error('Error fetching groups:', error);
      });
    };
    getUserInfo();
    getGroupNames();
  }, []);

  useEffect(() => {
    const fetchImagesByUploader = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/images/by-uploader`, {
          params: { uploaderId: '59995a1b-a2c6-11ef-aafe-8c1645e72e09' },
        });
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching personal images:', error);
      }
    };

    const fetchLikedImages = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/images/liked-by-user`, {
          params: { userId: '59995a1b-a2c6-11ef-aafe-8c1645e72e09' },
        });
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching liked images:', error);
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
      setIsLoading(true)
      const response = await fetch(`http://localhost:3001/images/${image.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete image');
      }
      setImages(prevImages => prevImages.filter(img => img.id !== image.id));
      setSelectedImage(null);
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex">
      <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', backgroundColor: '#00A2E8' },
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
            <Typography style={{fontSize: 24, color: 'white', textAlign:'left'}}>
                Home
            </Typography>
          </Button>
      </Drawer>
      {isLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 9999,
            }}
          >
            <CircularProgress />
          </Box>
        )}
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
        <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 20 }}>
          <Typography variant="h4" fontWeight="bold">
            {user?.username}
          </Typography>
          <AvatarUploader
            userAvatarUrl={user?.avatarUrl}
            userId="59995a1b-a2c6-11ef-aafe-8c1645e72e09"
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
            <Tab label="Your Images" />
            <Tab label="Liked Images" />
          </Tabs>
        </Box>

        <Box sx={{ marginTop: 4, marginBottom: 2, width: '80%' }}>
          <Grid2 container spacing={2} justifyContent="center">
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
                      + Add Photo
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
            {images.map((image) => (
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
            ))}
          </Grid2>
        </Box>

        <SelectedImageDialog
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={handleDeleteImage}
        />

        <AddPhotoDialog
          open={openUploadDialog}
          onClose={() => setOpenUploadDialog(false)}
          groupInfo={groupInfo}
          onImageUploadSuccess={handleImageUploadSuccess}
          userId="59995a1b-a2c6-11ef-aafe-8c1645e72e09"
          formData={formData}
          setFormData={setFormData} 
          setIsLoading={setIsLoading}     
        />
      </Box>
    </Box>
  );
};

export default ProfileScreen;
