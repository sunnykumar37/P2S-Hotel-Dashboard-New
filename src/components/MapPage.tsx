import React from 'react';
import { Box, Typography, Container, Grid, Paper, useTheme } from '@mui/material';
import MapComponent from './MapComponent';

const MapPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 3
          }}
        >
          Location Map
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MapComponent />
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3, 
                borderRadius: '20px',
                height: '100%',
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Nearby Hotels
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Hotels in your area that are participating in food donation programs.
                </Typography>
              </Box>
              {[1, 2, 3].map((item) => (
                <Box 
                  key={item}
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    borderRadius: '12px',
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Hotel {item}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {3 - item} km away • {item * 2} food items available
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3, 
                borderRadius: '20px',
                height: '100%',
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                NGO Partners
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  NGOs in your region that are actively collecting food donations.
                </Typography>
              </Box>
              {[1, 2, 3].map((item) => (
                <Box 
                  key={item}
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    borderRadius: '12px',
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    NGO {item}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {2 + item} km away • Serves {item * 100} people daily
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default MapPage; 