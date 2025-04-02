import React, { useState, useEffect } from 'react';
import {
  Badge,
  Box,
  Popover,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Chip,
  Avatar,
  Button,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  DeleteOutline as DeleteIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  WarningAmber as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

const NotificationsComponent: React.FC = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate sample notifications
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: 1,
        title: 'New Donation Available',
        message: 'Hotel Grand Plaza has 5kg of rice available for donation.',
        time: '10 minutes ago',
        read: false,
        type: 'info',
      },
      {
        id: 2,
        title: 'Delivery Confirmed',
        message: 'NGO Food for All has confirmed the receipt of today\'s donation.',
        time: '1 hour ago',
        read: false,
        type: 'success',
      },
      {
        id: 3,
        title: 'Donation Expiring Soon',
        message: 'The vegetables donation from Taj Hotel will expire in 6 hours.',
        time: '3 hours ago',
        read: true,
        type: 'warning',
      },
    ];

    setNotifications(sampleNotifications);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const handleDeleteAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
      case 'success':
        return <CheckCircleOutlineIcon sx={{ color: theme.palette.success.main }} />;
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'error':
        return <WarningIcon sx={{ color: theme.palette.error.main }} />;
      default:
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const open = Boolean(anchorEl);
  const id = open ? 'notifications-popover' : undefined;

  return (
    <>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        size="large"
        sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPopover-paper': {
            width: 360,
            maxHeight: 500,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            borderRadius: '12px',
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} new`}
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: '0.75rem' }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllAsRead}
                sx={{ fontSize: '0.75rem' }}
              >
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                size="small"
                color="error"
                onClick={handleDeleteAllNotifications}
                sx={{ fontSize: '0.75rem' }}
                startIcon={<DeleteIcon fontSize="small" />}
              >
                Clear all
              </Button>
            )}
          </Box>
        </Box>

        {notifications.length === 0 ? (
          <Box
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.text.secondary,
            }}
          >
            <NotificationsIcon
              sx={{ fontSize: 48, color: theme.palette.action.disabled, mb: 2 }}
            />
            <Typography>No notifications</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    px: 2,
                    py: 1.5,
                    backgroundColor: notification.read
                      ? 'transparent'
                      : theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.02)',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                        bgcolor: 'transparent',
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: notification.read ? 400 : 600,
                            color: notification.read
                              ? theme.palette.text.primary
                              : theme.palette.primary.main,
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          {notification.time}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          mt: 0.5,
                          lineHeight: 1.3,
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          mt: 1,
                          gap: 1,
                        }}
                      >
                        {!notification.read && (
                          <Button
                            size="small"
                            onClick={() => handleMarkAsRead(notification.id)}
                            sx={{ fontSize: '0.7rem', minWidth: 'auto', p: '2px 8px' }}
                          >
                            Mark as read
                          </Button>
                        )}
                        <IconButton
                          size="small"
                          edge="end"
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                          sx={{ p: 0.5 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
};

export default NotificationsComponent; 