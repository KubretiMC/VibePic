import React, { useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ActionButtons from '../components/ActionButtons';
import { useTranslation } from 'react-i18next';
import { api } from '../../../api/api';

interface AvatarUploaderProps {
  userAvatarUrl?: string;
  onAvatarUpdate: (newAvatarUrl: string) => void;
  setIsLoading: (loading: boolean) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ userAvatarUrl, onAvatarUpdate, setIsLoading }) => {
  const { t } = useTranslation();
  const cropperRef = useRef<ReactCropperElement>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadCroppedImage = async () => {
    if (cropperRef.current?.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      croppedCanvas.toBlob(async (blob) => {
        if (blob) {
          const formData = new FormData();
          formData.append('file', blob);
          setIsLoading(true);
          try {
            const response = await api.post('/users/upload-avatar', formData);
            const data = response.data;
            onAvatarUpdate(data.avatarUrl);
            setAvatarImage(null);
          } catch (error) {
            console.error('Error uploading avatar:', error);
          } finally {
            setIsLoading(false);
          }
        }
      }, 'image/jpeg');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 2,
      }}
    >
      {avatarImage ? (
        <Cropper
          style={{ maxHeight: 600, maxWidth: 400 }}
          src={avatarImage}
          ref={cropperRef}
          minCropBoxHeight={200}
          minCropBoxWidth={200}
          zoomable={false}
        />
      ) : userAvatarUrl ? (
        <Box
          component="img"
          src={userAvatarUrl}
          alt="Current Avatar"
          sx={{
            width: '220px',
            height: '220px',
            objectFit: 'cover',
          }}
        />
      ) : (
        <AccountCircleIcon sx={{ color: 'red', fontSize: 280 }} />
      )}

      {avatarImage ? (
        <ActionButtons
          addButtonName={t('SAVE_IMAGE')}
          cancelButtonName={t('CANCEL')}
          onAddButtonClick={uploadCroppedImage}
          onCancelButtonClick={() => setAvatarImage(null)}
        />
      ) : (
        <Button
          color="primary"
          sx={{ textTransform: 'none', fontSize: 18 }}
          component="label"
        >
          {t('CHANGE_IMAGE')}
          <input type="file" accept="image/*" hidden onChange={onAvatarChange} />
        </Button>
      )}
    </Box>
  );
};

export default AvatarUploader;
