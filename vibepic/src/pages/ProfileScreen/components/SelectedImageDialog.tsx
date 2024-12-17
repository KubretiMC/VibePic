import React from 'react';
import { Dialog, DialogContent, Box, Typography, Button } from '@mui/material';
import { Image } from '../../../models/Image';

interface SelectedImageDialogProps {
  selectedImage: Image | null;
  deleteButtonText: string;
  onClose: () => void;
  onDelete: (image: Image) => void;
}

const SelectedImageDialog: React.FC<SelectedImageDialogProps> = ({
  selectedImage,
  deleteButtonText,
  onClose,
  onDelete,
}) => {
  if (!selectedImage) return null;

  return (
    <Dialog open={!!selectedImage} onClose={onClose} maxWidth="lg">
      <DialogContent>
        <Box
          component="img"
          src={selectedImage.imagePath}
          alt={selectedImage.description}
          sx={{
            width: '100%',
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
            marginTop: 1,
          }}
          onClick={() => onDelete(selectedImage)}
        >
          {deleteButtonText}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SelectedImageDialog;
