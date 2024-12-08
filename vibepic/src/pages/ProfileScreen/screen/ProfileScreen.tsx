import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Tabs, Tab, Dialog, DialogContent, Grid2, FormControl, InputLabel, Select, MenuItem, TextField, Drawer } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { User } from '../../../models/User';
import ActionButtons from '../components/ActionButtons';
import { useNavigate } from 'react-router-dom';
import { Image } from '../../../models/Image';
import { Group } from '../../../models/Group';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [images, setImages] = useState<Image[]>([]);
  const [user, setUser] = useState<User>();
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [groupInfo, setGroupInfo] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [tempImage, setTempImage] = useState<File | null>(null);  // Holds the temporary image
  const [tempImageUrl, setTempImageUrl] = useState<string>('');
  const [openUploadDialog, setOpenUploadDialog] = useState(false);  
  const [imageDescription, setImageDescription] = useState<string>('');  

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

  const onImageUpload = async (tempImage: any) => {  
    const formData = new FormData();
    formData.append("file", tempImage);
    formData.append("userId", "59995a1b-a2c6-11ef-aafe-8c1645e72e09");
    formData.append("description", imageDescription);
    formData.append("groupId", selectedGroup);
    
    try {
      const response = await fetch(`http://localhost:3001/images/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
  
      if (data.image) {
        setImages([
          data.image,
          ...images
        ]);
        resetFields();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setTempImage(null);
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

  const onAddImageClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      setTempImage(file);
      setTempImageUrl(URL.createObjectURL(file));
      setOpenUploadDialog(true); 
    }
  };

  const resetFields = () => {
    setTempImage(null);
    setTempImageUrl('');
    setOpenUploadDialog(false);
    setSelectedGroup('');
    setSelectedImage(null);
    setImageDescription(''); 
  }

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
              zoomable={false}
            />
            :
            user?.avatarUrl ?
              <img style={{ width: "220px", height: "220px", marginTop: 10 }} src={user.avatarUrl} alt="cropped" />
              :
              <AccountCircleIcon sx={{ color: 'red', fontSize: 280 }} />
          }
          {avatarImage ?
            <ActionButtons 
              addButtonName={'Save Image'} 
              cancelButtonName={'Cancel'} 
              onAddButtonClick={uploadCroppedImage} 
              onCancelButtonClick={() => setAvatarImage('')} 
            />
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
                      + Add Photo
                    </Typography>
                  </Box>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={onAddImageClick}
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

        <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="lg">
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
              <Button
                variant="outlined"
                sx={{
                  flexGrow: 1,
                  backgroundColor: 'red',
                  textTransform: 'none',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 16,
                  width: '100%',
                  marginTop: 1
                }}
                onClick={() =>  handleDeleteImage(selectedImage)}
              >
                Delete
              </Button>
            </DialogContent>
          )}
        </Dialog>

        <Dialog open={openUploadDialog} onClose={resetFields}>
          <DialogContent>
            <Typography variant="h6">Upload Image</Typography>
            
            {tempImageUrl && (
              <Box
                component="img"
                src={tempImageUrl}
                alt="Uploaded Preview"
                sx={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  marginBottom: 2,
                }}
              />
            )}

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              sx={{ marginBottom: 2 }}
            />

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Group</InputLabel>
              <Select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                {groupInfo.map((group, index) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <ActionButtons
              addButtonName="Upload"
              cancelButtonName="Cancel"
              onAddButtonClick={() => onImageUpload(tempImage)}
              onCancelButtonClick={resetFields}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ProfileScreen;
