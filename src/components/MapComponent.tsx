import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  Slider, 
  IconButton, 
  CircularProgress,
  useTheme
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyCP7fUHlKJ3_sWt7jw2gVg0ZeRIYIIpMio';

interface MapComponentProps {
  containerStyle?: React.CSSProperties;
}

const MapComponent: React.FC<MapComponentProps> = ({ containerStyle }) => {
  const theme = useTheme();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchRadius, setSearchRadius] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [markers, setMarkers] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Load Google Maps API script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initializeMap();
    }

    return () => {
      // Cleanup markers when component unmounts
      markers.forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      });
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Default center (can be changed later)
    const defaultCenter = { lat: 31.326, lng: 75.576 }; // Jalandhar coordinates

    const mapOptions = {
      center: defaultCenter,
      zoom: 12,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: window.google.maps.ControlPosition.TOP_LEFT,
      },
      fullscreenControl: false,
      streetViewControl: false,
      styles: theme.palette.mode === 'dark' ? [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ] : [],
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);
    setIsLoading(false);

    // Add some sample locations (hotels or NGOs)
    addSampleMarkers(newMap);

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(pos);
          
          // Add a marker for current location
          const marker = new window.google.maps.Marker({
            position: pos,
            map: newMap,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "white",
              strokeWeight: 2,
            },
            title: 'Your Location',
          });
          
          setMarkers(prev => [...prev, marker]);
          
          // Add info window for current location
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="padding: 8px; color: #000000;">
                        <strong>Your Current Location</strong><br/>
                        Latitude: ${pos.lat.toFixed(6)}<br/>
                        Longitude: ${pos.lng.toFixed(6)}
                      </div>`,
          });
          
          marker.addListener('click', () => {
            infoWindow.open(newMap, marker);
          });
          
          newMap.setCenter(pos);
        },
        () => {
          console.log('Error: The Geolocation service failed.');
        }
      );
    }
  };

  // Add sample markers for demo purposes
  const addSampleMarkers = (map: google.maps.Map) => {
    if (!window.google) return;
    
    const locations = [
      { lat: 31.3260, lng: 75.5762, name: 'Jalandhar Hotel A', type: 'hotel' },
      { lat: 31.3310, lng: 75.5812, name: 'Jalandhar Hotel B', type: 'hotel' },
      { lat: 31.3200, lng: 75.5700, name: 'Local NGO 1', type: 'ngo' },
      { lat: 31.3350, lng: 75.5900, name: 'Local NGO 2', type: 'ngo' },
      { lat: 31.3280, lng: 75.5730, name: 'Food Delivery Center', type: 'hotel' },
    ];

    const hotelIcon = {
      url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      scaledSize: new window.google.maps.Size(32, 32),
    };

    const ngoIcon = {
      url: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
      scaledSize: new window.google.maps.Size(32, 32),
    };

    const newMarkers = locations.map(location => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.name,
        icon: location.type === 'hotel' ? hotelIcon : ngoIcon,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="padding: 8px; color: #000000;">
                    <strong>${location.name}</strong><br/>
                    Type: ${location.type === 'hotel' ? 'Hotel' : 'NGO'}<br/>
                    <a href="#" style="color: blue;">View Details</a>
                  </div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      return marker;
    });

    setMarkers(prev => [...prev, ...newMarkers]);
  };

  const handleMyLocation = () => {
    if (currentLocation && map) {
      map.setCenter(currentLocation);
      map.setZoom(15);
      
      // Create and open an info window at the user's location
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="padding: 8px; color: #000000;">
                    <strong>Your Current Location</strong><br/>
                    Latitude: ${currentLocation.lat.toFixed(6)}<br/>
                    Longitude: ${currentLocation.lng.toFixed(6)}
                  </div>`,
        position: currentLocation
      });
      infoWindow.open(map);
    } else {
      // Try to get location if not already available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrentLocation(pos);
            
            if (map) {
              map.setCenter(pos);
              map.setZoom(15);
              
              // Create and open an info window at the user's location
              const infoWindow = new window.google.maps.InfoWindow({
                content: `<div style="padding: 8px; color: #000000;">
                            <strong>Your Current Location</strong><br/>
                            Latitude: ${pos.lat.toFixed(6)}<br/>
                            Longitude: ${pos.lng.toFixed(6)}
                          </div>`,
                position: pos
              });
              infoWindow.open(map);
            }
          },
          () => {
            console.log('Error: The Geolocation service failed.');
            // Show an alert if location service fails
            if (map) {
              const infoWindow = new window.google.maps.InfoWindow({
                content: `<div style="padding: 8px; color: #d32f2f;">
                            <strong>Location Error</strong><br/>
                            Geolocation service failed.<br/>
                            Please enable location services in your browser.
                          </div>`,
                position: map.getCenter()
              });
              infoWindow.open(map);
            }
          }
        );
      } else {
        console.log('Error: Your browser does not support geolocation.');
        // Show an alert if browser doesn't support geolocation
        if (map) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="padding: 8px; color: #d32f2f;">
                        <strong>Location Error</strong><br/>
                        Your browser does not support geolocation.
                      </div>`,
            position: map.getCenter()
          });
          infoWindow.open(map);
        }
      }
    }
  };

  const handleSearch = () => {
    if (!map || !searchLocation.trim() || !window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchLocation }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(15);

        // Add a marker for the searched location
        const searchMarker = new window.google.maps.Marker({
          position: location,
          map,
          animation: window.google.maps.Animation.DROP,
          title: results[0].formatted_address,
        });

        setMarkers(prev => [...prev, searchMarker]);

        // Draw a circle for the search radius
        const circle = new window.google.maps.Circle({
          map,
          center: location,
          radius: searchRadius * 1000, // Convert km to meters
          fillColor: '#4285F4',
          fillOpacity: 0.2,
          strokeColor: '#4285F4',
          strokeOpacity: 0.5,
          strokeWeight: 1,
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="padding: 8px; color: #000000;">
                      <strong>${results[0].formatted_address}</strong><br/>
                      Searching within ${searchRadius} km radius
                    </div>`,
        });
        
        searchMarker.addListener('click', () => {
          infoWindow.open(map, searchMarker);
        });
        
        // Open info window immediately
        infoWindow.open(map, searchMarker);
      }
    });
  };

  const handleZoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom()! + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom()! - 1);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: '20px',
        bgcolor: theme.palette.background.paper,
        ...containerStyle,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Interactive Map
        </Typography>
        <Button
          variant="contained"
          startIcon={<MyLocationIcon />}
          onClick={handleMyLocation}
          size="small"
        >
          My Location
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          placeholder="Search location..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          size="small"
          fullWidth
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" gutterBottom>
          Search Radius: {searchRadius} km
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2">1km</Typography>
          <Slider
            size="small"
            value={searchRadius}
            min={1}
            max={20}
            onChange={(_, value) => setSearchRadius(value as number)}
            sx={{ mx: 2 }}
          />
          <Typography variant="body2">20km</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'relative',
          height: '400px',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <Box
          ref={mapRef}
          sx={{
            width: '100%',
            height: '100%',
          }}
        />
        
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        
        <Box
          sx={{
            position: 'absolute',
            right: 16,
            bottom: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <IconButton 
            onClick={handleZoomIn}
            sx={{ 
              backgroundColor: theme.palette.background.paper,
              '&:hover': { backgroundColor: theme.palette.action.hover },
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
            size="small"
          >
            <AddIcon />
          </IconButton>
          <IconButton 
            onClick={handleZoomOut}
            sx={{ 
              backgroundColor: theme.palette.background.paper,
              '&:hover': { backgroundColor: theme.palette.action.hover },
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
            size="small"
          >
            <RemoveIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            fontSize: '10px',
            color: theme.palette.text.secondary,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: '2px 4px',
            borderRadius: '4px',
          }}
        >
          © Google Maps
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing results within {searchRadius} km radius of the selected location. Click on markers to see details.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              backgroundColor: '#4285F4' 
            }} />
            <Typography variant="body2">Hotels</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              backgroundColor: '#a142f4' 
            }} />
            <Typography variant="body2">NGOs</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default MapComponent; 