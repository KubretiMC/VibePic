import React from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Group } from '../../../models/Group';
import ActionButtons from '../components/ActionButtons';
import { useTranslation } from 'react-i18next';
import { api } from '../../../api/api';

interface AddPhotoDialogProps {
  open: boolean;
  onClose: () => void;
  groupInfo: Group[];
  onImageUploadSuccess: (image: any) => void;
  setIsLoading: (loading: boolean) => void;
  formData: any;
  setFormData: any;
}

const AddPhotoDialog: React.FC<AddPhotoDialogProps> = ({
  open,
  onClose,
  groupInfo,
  onImageUploadSuccess,
  setIsLoading,
  formData,
  setFormData
}) => {
  const { t } = useTranslation();
  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.tempImage && formData.imageDescription && formData.selectedGroup;
  }
  const resetFields = () => {
    setFormData({
      tempImage: null,
      tempImageUrl: '',
      imageDescription: '',
      selectedGroup: '',
    });
    onClose();
  };

  const handleImageUpload = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('file', formData.tempImage!);
    formDataToSend.append('description', formData.imageDescription);
    formDataToSend.append('groupId', formData.selectedGroup);

    setIsLoading(true);
  
    try {
      const response = await api.post('/images/upload', formDataToSend);
      const data = response.data;

      if (data.image) {
        onImageUploadSuccess(data.image);
        resetFields();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsLoading(false);
      formData.tempImage = null;
    }
  };

  return (
    <Dialog open={open} onClose={resetFields}>
      <DialogContent>
        <Typography variant="h6" textAlign={'center'}>{t('UPLOAD_IMAGE')}</Typography>

        {formData.tempImageUrl && (
          <Box
            component="img"
            src={formData.tempImageUrl}
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
          label={t('DESCRIPTION')}
          fullWidth
          multiline
          rows={4}
          value={formData.imageDescription}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 60) {
              handleInputChange('imageDescription', value);
            }
          }}
          error={formData.imageDescription.length > 60}
          helperText={
            formData.imageDescription.length > 60
              ? t('DESCRIPTION_ERROR')
              : `${formData.imageDescription.length}/60`
          }
          sx={{ marginBottom: 2 }}
        />

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>{t('GROUP')}</InputLabel>
          <Select
            value={formData.selectedGroup}
            onChange={(e) => handleInputChange('selectedGroup', e.target.value)}
          >
            {groupInfo.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {t(group.name)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ActionButtons
          addButtonName={t('UPLOAD')}
          cancelButtonName={t('CANCEL')}
          onAddButtonClick={handleImageUpload}
          onCancelButtonClick={resetFields}
          disabled={!isFormValid()}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddPhotoDialog;
