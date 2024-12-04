import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Tabs, Tab, Dialog, DialogContent, Grid2 } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DrawerComponent from '../../components/DrawerComponent';
import { useImageLoader } from '../../hooks/useImageLoader';
import axios from 'axios';
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { User } from '../../models/User';

interface Image {
  id: string;
  description: string;
  likes: number;
  imagePath: string;
  createdAt: string;
  uploaderName: string;
  groupId?: string;
}

const ProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [images, setImages] = useState<Image[]>([]);
  const [user, setUser] = useState<User>();
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
    const getUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/59995a1b-a2c6-11ef-aafe-8c1645e72e09`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching personal images:', error);
      }
    };
    getUserInfo();
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

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const [avatarImage, setAvatarImage] = useState('');
  const cropperRef = useRef<ReactCropperElement>(null);

  const onAvatarChange = (e: any) => {
    e.preventDefault();
    let files;
    if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarImage(reader.result as any);
    };
    reader.readAsDataURL(files[0]);
  };

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
  
    const files = e.target?.files;
    if (!files || files.length === 0) {
      console.error("No files selected.");
      return;
    }
  
    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", "59995a1b-a2c6-11ef-aafe-8c1645e72e09");
  
    try {
      const response = await fetch(`http://localhost:3001/images/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
  
      if (user) {
        setImages([
          data.image,
          ...images
        ]);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      e.target.value = "";
    }
  };

  const uploadCroppedImage = async () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas();
  
      if (croppedCanvas) {
        croppedCanvas.toBlob(async (blob) => {
          if (blob) {
            const formData = new FormData();
            formData.append("file", blob);
            formData.append("userId", "59995a1b-a2c6-11ef-aafe-8c1645e72e09");
        
            try {
              const response = await fetch(`http://localhost:3001/users/upload-avatar`, {
                method: "POST",
                body: formData,
              });
              const data = await response.json();

              if(user) {
                setUser({
                  ...user,
                  avatarUrl: data.avatarUrl
                });
              }
              setAvatarImage('');
            } catch (error) {
              console.error("Error uploading image:", error);
            }
          }
        }, "image/jpeg");
      }
    }
  };

  const handleAddToGroup = (image: Image) => {
    console.log(`Add image ${image.id} to a group`);
  };
  
  const handleDeleteImage = async (image: Image) => {
    try {
      const response = await fetch(`http://localhost:3001/images/${image.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete image');
      }
      setImages(prevImages => prevImages.filter(img => img.id !== image.id));
      setSelectedImage(null);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
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
        <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 20 }}>
          <Typography variant="h4" fontWeight="bold">
            {user?.username}
          </Typography>
          {avatarImage ?
            <Cropper
              style={{ maxHeight: 600, maxWidth: 400 }}
              src={avatarImage}
              ref={cropperRef}
              minCropBoxHeight={200}
              minCropBoxWidth={200}
              // responsive={true}
              zoomable={false}
            />
            :
            user?.avatarUrl ?
              <img style={{ width: "220px", height: "220px", marginTop: 10 }} src={user.avatarUrl} alt="cropped" />
              :
              <AccountCircleIcon sx={{ color: 'red', fontSize: 280 }} />
          }
          {avatarImage ?
            <Box display="flex" gap={2}>
            <Button
              color="primary"
              sx={{ textTransform: 'none', fontSize: 18 }}
              onClick={uploadCroppedImage}
            >
              Save Image
            </Button>
            <Button
              color="primary"
              sx={{ textTransform: 'none', fontSize: 18 }}
              onClick={() => setAvatarImage('')}
            >
              Cancel
            </Button>
          </Box>
          :
            <Button
              color="primary"
              sx={{ textTransform: 'none', fontSize: 18 }}
              component="label"
            >
              Change Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={onAvatarChange}
              />
            </Button>
          }
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
                      +
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold' }}>
                      Add Photo
                    </Typography>
                  </Box>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={onImageUpload}
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
                  onClick={() => handleImageClick(image)}
                />
              </Grid2>
            ))}
          </Grid2>
        </Box>

        <Dialog open={!!selectedImage} onClose={handleCloseModal} maxWidth="lg">
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

              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  mt: 2,
                  gap: 2,
                }}
              >
                {selectedImage.groupId === undefined && (
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                      flexGrow: 1,
                      border: 2,
                      backgroundColor: '#00A2E8',
                      textTransform: 'none',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 16,
                      width: '50%'
                    }}
                    onClick={() => handleAddToGroup(selectedImage)}
                  >
                    Add to Group
                  </Button>
                )}
                <Button
                  variant="outlined"
                  sx={{
                    flexGrow: 1,
                    backgroundColor: 'red',
                    textTransform: 'none',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 16,
                    width: '50%'
                  }}
                  onClick={() => handleDeleteImage(selectedImage)}
                >
                  Delete
                </Button>
              </Box>
            </DialogContent>
          )}
        </Dialog>
      </Box>
    </Box>
  );
};

export default ProfileScreen;
