import React from 'react';
import { Snackbar } from '@mui/material';

interface NotificationComponentProps {
    notificationText: string;
    setNotificationText: (notificaitonText: string) => void;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({ notificationText, setNotificationText }) => {
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setNotificationText('');
    };
    
    return (
        <Snackbar
            open={notificationText !== ''}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            message={notificationText}
            sx={{
                '& .MuiSnackbarContent-root': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    backgroundColor: '#333',
                    color: '#fff',
                },
            }}
        />
    )
};

export default NotificationComponent;
