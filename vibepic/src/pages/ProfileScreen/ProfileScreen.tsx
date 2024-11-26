import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Tabs, Tab, Dialog, DialogContent, Grid2 } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DrawerComponent from '../../components/DrawerComponent';
import { useImageLoader } from '../../hooks/useImageLoader';
import axios from 'axios';

interface Image {
  id: string;
  description: string;
  likes: number;
  imagePath: string;
  createdAt: string;
  uploaderName: string;
}

const ProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const { dateFilter, likedFilter, updateDateFilter, updateLikeFilter } = useImageLoader(
    `http://localhost:3001/images`,
    '59995a1b-a2c6-11ef-aafe-8c1645e72e09'
  );

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

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };

  return (
    <Box display="flex">
      <DrawerComponent
        dateFilter={dateFilter}
        likedFilter={likedFilter}
        updateDateFilter={updateDateFilter}
        updateLikeFilter={updateLikeFilter}
      />
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
        <AccountCircleIcon sx={{ color: 'red', fontSize: 280, marginBottom: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Mariqnko
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          sx={{ marginBottom: 4 }}
        >
          Change Image
        </Button>

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

        <Box sx={{ marginTop: 4, width: '80%' }}>
          {activeTab === 0 && (
            <Grid2 container spacing={2} justifyContent="center">
              {images.map((image) => (
                <Grid2 key={image.id} size={{ xs:12, sm: 6, md:4 }}>
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
                    onClick={() => handleImageClick(image)}
                  />
                </Grid2>
              ))}
            </Grid2>
          )}
          {activeTab === 1 && (
            <Grid2 container spacing={2} justifyContent="center">
              {images.map((image) => (
                <Grid2 key={image.id} size={{ xs:12, sm: 6, md:4 }}>
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
                    onClick={() => handleImageClick(image)}
                  />
                </Grid2>
              ))}
            </Grid2>
          )}
        </Box>

        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg">
          {selectedImage && (
            <DialogContent>
              <Box
                component="img"
                src={selectedImage.imagePath}
                alt={selectedImage.description}
                sx={{
                  width: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                }}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                {selectedImage.description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Uploaded on: {new Date(selectedImage.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Likes: {selectedImage.likes}
              </Typography>
            </DialogContent>
          )}
        </Dialog>
      </Box>
    </Box>
  );
};

export default ProfileScreen;
