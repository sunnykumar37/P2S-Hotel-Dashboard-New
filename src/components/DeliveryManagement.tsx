import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

interface Delivery {
  id: string;
  ngoName: string;
  date: string;
  time: string;
  meals: number;
  status: 'scheduled' | 'in_transit' | 'delivered' | 'cancelled';
  driver?: string;
  vehicleNumber?: string;
}

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      id: '1',
      ngoName: 'Food Bank A',
      date: '2024-03-30',
      time: '14:00',
      meals: 50,
      status: 'scheduled',
      driver: 'John Doe',
      vehicleNumber: 'ABC123',
    },
    {
      id: '2',
      ngoName: 'Community Kitchen B',
      date: '2024-03-30',
      time: '15:30',
      meals: 30,
      status: 'in_transit',
      driver: 'Jane Smith',
      vehicleNumber: 'XYZ789',
    },
  ]);

  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (selectedDelivery) {
      setDeliveries(deliveries.map(delivery => 
        delivery.id === selectedDelivery.id 
          ? { ...delivery, status: selectedDelivery.status }
          : delivery
      ));
    }
    setOpenDialog(false);
    setSelectedDelivery(null);
  };

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'scheduled':
        return 'info';
      case 'in_transit':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: Delivery['status']): JSX.Element => {
    switch (status) {
      case 'scheduled':
        return <ScheduleIcon />;
      case 'in_transit':
        return <LocalShippingIcon />;
      case 'delivered':
        return <CheckCircleIcon />;
      case 'cancelled':
        return <PendingIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  const handleStatusChange = (deliveryId: string, newStatus: Delivery['status']) => {
    setDeliveries(deliveries.map(delivery =>
      delivery.id === deliveryId
        ? { ...delivery, status: newStatus }
        : delivery
    ));
    handleCloseDialog();
  };

  const handleUpdateDelivery = () => {
    if (selectedDelivery) {
      setDeliveries(deliveries.map(delivery =>
        delivery.id === selectedDelivery.id
          ? selectedDelivery
          : delivery
      ));
      handleCloseDialog();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Delivery Management
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          { title: 'Scheduled Deliveries', status: 'scheduled' },
          { title: 'In Transit', status: 'in_transit' },
          { title: 'Delivered Today', status: 'delivered' },
          { title: 'Cancelled', status: 'cancelled' },
        ].map((item) => (
          <Grid item xs={12} md={3} key={item.status}>
            <StyledCard>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="h4">
                  {deliveries.filter(d => d.status === item.status).length}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
            transition: 'box-shadow 0.3s ease'
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NGO Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Meals</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Vehicle</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveries.map((delivery) => (
              <StyledTableRow key={delivery.id}>
                <TableCell>{delivery.ngoName}</TableCell>
                <TableCell>{delivery.date}</TableCell>
                <TableCell>{delivery.time}</TableCell>
                <TableCell>{delivery.meals}</TableCell>
                <TableCell>{delivery.driver || '-'}</TableCell>
                <TableCell>{delivery.vehicleNumber || '-'}</TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(delivery.status)}
                    label={delivery.status.replace('_', ' ')}
                    color={getStatusColor(delivery.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <StyledButton
                    variant="contained"
                    size="small"
                    onClick={() => handleOpenDialog(delivery)}
                  >
                    Update Status
                  </StyledButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle>Update Delivery Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Status"
            value={selectedDelivery?.status || ''}
            onChange={(e) => setSelectedDelivery(prev => 
              prev ? { ...prev, status: e.target.value as Delivery['status'] } : null
            )}
            sx={{ mt: 2 }}
          >
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="in_transit">In Transit</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Driver Name"
            value={selectedDelivery?.driver || ''}
            onChange={(e) => setSelectedDelivery(prev => 
              prev ? { ...prev, driver: e.target.value } : null
            )}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Vehicle Number"
            value={selectedDelivery?.vehicleNumber || ''}
            onChange={(e) => setSelectedDelivery(prev => 
              prev ? { ...prev, vehicleNumber: e.target.value } : null
            )}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <StyledButton variant="contained" onClick={handleUpdateDelivery}>
            Update
          </StyledButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryManagement; 