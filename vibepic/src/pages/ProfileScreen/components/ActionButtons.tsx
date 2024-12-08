import React from 'react';
import { Button, Box } from '@mui/material';

interface ActionButtonsProps {
  addButtonName: string;
  cancelButtonName: string;
  onAddButtonClick: () => void;
  onCancelButtonClick: () => void;
  disabled?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ addButtonName, cancelButtonName, onAddButtonClick, onCancelButtonClick, disabled }) => {
  return (
    <Box display="flex" justifyContent="space-between" mt={2} gap={2}>
    {
      <Button
        variant="outlined"
        color="primary"
        disabled={disabled}
        sx={{
          flexGrow: 1,
          backgroundColor: '#00A2E8',
          textTransform: 'none',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 16,
          width: '50%',
        }}
        onClick={onAddButtonClick}
      >
        {addButtonName}
      </Button>
    }
      <Button
        variant="outlined"
        sx={{
          flexGrow: 1,
          backgroundColor: 'red',
          textTransform: 'none',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 16,
          width: '50%',
        }}
        onClick={onCancelButtonClick}
      >
        {cancelButtonName}
      </Button>
    </Box>
  );
};

export default ActionButtons;
