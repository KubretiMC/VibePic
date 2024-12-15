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
import axios from 'axios';

interface AddPhotoDialogProps {
  open: boolean;
  onClose: () => void;
  groupInfo: Group[];
  onImageUploadSuccess: (image: any) => void;
  setIsLoading: (loading: boolean) => void;
  formData: any;
  setFormData: any;
  authToken: string;
}

const AddPhotoDialog: React.FC<AddPhotoDialogProps> = ({
  open,
  onClose,
  groupInfo,
  onImageUploadSuccess,
  setIsLoading,
  formData,
  setFormData,
  authToken
}) => {
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
    if (!isFormValid()) {
      alert('Please fill all fields before uploading.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('file', formData.tempImage!);
    formDataToSend.append('description', formData.imageDescription);
    formDataToSend.append('groupId', formData.selectedGroup);

    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/images/upload`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
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
        <Typography variant="h6">Upload Image</Typography>

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
          label="Description"
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
              ? 'Description must be 60 characters or less.'
              : `${formData.imageDescription.length}/60`
          }
          sx={{ marginBottom: 2 }}
        />

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Group</InputLabel>
          <Select
            value={formData.selectedGroup}
            onChange={(e) => handleInputChange('selectedGroup', e.target.value)}
          >
            {groupInfo.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ActionButtons
          addButtonName="Upload"
          cancelButtonName="Cancel"
          onAddButtonClick={handleImageUpload}
          onCancelButtonClick={resetFields}
          disabled={!isFormValid()}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddPhotoDialog;
