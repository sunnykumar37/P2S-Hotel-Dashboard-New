import React, { useState, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  Assessment as AssessmentIcon,
  Message as MessageIcon,
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Kitchen as KitchenIcon,
  BarChart as BarChartIcon,
  Notifications as NotificationsIcon,
  VolunteerActivism as VolunteerActivismIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import DonationsManagement from './components/DonationsManagement';
import FoodListing from './components/FoodListing';
import NGOPartners from './components/NGOPartners';
import Reports from './components/Reports';
import Communication from './components/Communication';
import MapPage from './components/MapPage';
import './App.css';

const drawerWidth = 280;

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#1976d2',
          },
          background: {
            default: mode === 'light' ? '#f8f9fa' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#2c3e50' : '#ecf0f1',
            secondary: mode === 'light' ? '#7f8c8d' : '#bdc3c7',
          },
        },
        components: {
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                borderRight: '1px solid',
                borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                color: mode === 'light' ? '#2c3e50' : '#ecf0f1',
                boxShadow: mode === 'light' 
                  ? '0 2px 4px rgba(0,0,0,0.08)' 
                  : '0 2px 4px rgba(0,0,0,0.15)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                boxShadow: mode === 'light'
                  ? '0 2px 4px rgba(0,0,0,0.08)'
                  : '0 2px 4px rgba(0,0,0,0.15)',
              },
            },
          },
        },
      }),
    [mode]
  );

  const handleThemeToggle = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleSignOut = () => {
    navigate('/');
  };

  const menuItems = [
    {
      text: 'Dashboard',
      path: '/',
      icon: <DashboardIcon />,
      description: 'Overview of all activities',
    },
    {
      text: 'Map',
      path: '/map',
      icon: <MapIcon />,
      description: 'View location map',
    },
    {
      text: 'Donations',
      path: '/donations',
      icon: <VolunteerActivismIcon />,
      description: 'Manage food donations',
    },
    {
      text: 'Food Inventory',
      path: '/food',
      icon: <RestaurantIcon />,
      description: 'View and manage food items',
    },
    {
      text: 'NGO Partners',
      path: '/partners',
      icon: <PeopleIcon />,
      description: 'Manage NGO partnerships',
    },
    {
      text: 'Communication',
      path: '/communication',
      icon: <MessageIcon />,
      description: 'Messages and notifications',
    },
    {
      text: 'Reports',
      path: '/reports',
      icon: <AssessmentIcon />,
      description: 'View reports and analytics',
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Sidebar 
          menuItems={menuItems} 
          open={open} 
          setOpen={setOpen}
          mode={mode}
          onThemeToggle={handleThemeToggle}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: theme.palette.background.default,
            minHeight: '100vh',
            pt: { xs: 8, sm: 9 },
          }}
        >
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/donations" element={<DonationsManagement />} />
            <Route path="/food" element={<FoodListing />} />
            <Route path="/partners" element={<NGOPartners />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App; 