import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import NotificationsComponent from './NotificationsComponent';

const drawerWidth = 280;

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  menuItems, 
  open, 
  setOpen, 
  mode, 
  onThemeToggle 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleSignOut = () => {
    navigate('/');
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 500,
              flexGrow: 1,
            }}
          >
            {menuItems.find(item => item.path === location.pathname)?.text || 'Overview'}
          </Typography>
          
          <NotificationsComponent />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            ...(!open && {
              width: theme.spacing(7),
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }),
          },
        }}
        open={open}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '64px !important',
            px: [1],
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 600,
              textAlign: 'center',
              opacity: open ? 1 : 0,
              transition: 'opacity 0.2s',
            }}
          >
            Hotel Dashboard
          </Typography>
        </Toolbar>

        <Box sx={{ overflow: 'auto', flexGrow: 1, mt: 1 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                disablePadding
                sx={{
                  display: 'block',
                  mb: 0.5,
                }}
              >
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    mx: 1,
                    borderRadius: '8px',
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.12)'
                          : 'rgba(0, 0, 0, 0.06)',
                      },
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.04)'
                        : 'rgba(0, 0, 0, 0.02)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                      color: location.pathname === item.path
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    secondary={open ? item.description : null}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: location.pathname === item.path ? 600 : 400,
                        color: location.pathname === item.path
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                      }
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        opacity: 0.7,
                        fontSize: '0.75rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      display: open ? 'block' : 'none',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider />
        <Box sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <IconButton
            onClick={onThemeToggle}
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <IconButton
            onClick={handleSignOut}
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar; 