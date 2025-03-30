import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  MenuItem,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocalShipping as LocalShippingIcon,
} from '@mui/icons-material';

interface Donation {
  id: string;
  donorName: string;
  foodItems: string;
  quantity: number;
  unit: string;
  donationDate: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Distributed';
  notes?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`donation-tabpanel-${index}`}
      aria-labelledby={`donation-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const DonationsManagement: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  const [donations, setDonations] = useState<Donation[]>([
    {
      id: '1',
      donorName: 'Fresh Foods Inc.',
      foodItems: 'Rice, Lentils',
      quantity: 100,
      unit: 'kg',
      donationDate: '2024-03-17',
      status: 'Pending',
      notes: 'Regular weekly donation',
    },
    {
      id: '2',
      donorName: 'City Bakery',
      foodItems: 'Bread, Pastries',
      quantity: 50,
      unit: 'units',
      donationDate: '2024-03-16',
      status: 'Accepted',
    },
    {
      id: '3',
      donorName: 'Green Farms',
      foodItems: 'Vegetables',
      quantity: 75,
      unit: 'kg',
      donationDate: '2024-03-15',
      status: 'Distributed',
    },
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddDonation = () => {
    setSelectedDonation(null);
    setOpenDialog(true);
  };

  const handleEditDonation = (donation: Donation) => {
    setSelectedDonation(donation);
    setOpenDialog(true);
  };

  const handleDeleteDonation = (donationId: string) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      setDonations(donations.filter(donation => donation.id !== donationId));
    }
  };

  const handleStatusChange = (donationId: string, newStatus: Donation['status']) => {
    setDonations(donations.map(donation =>
      donation.id === donationId ? { ...donation, status: newStatus } : donation
    ));
  };

  const handleSaveDonation = () => {
    const form = document.querySelector('form');
    const formElements = form?.elements as any;

    const donationData: Donation = {
      id: selectedDonation?.id || String(donations.length + 1),
      donorName: formElements.donorName.value,
      foodItems: formElements.foodItems.value,
      quantity: Number(formElements.quantity.value),
      unit: formElements.unit.value,
      donationDate: formElements.donationDate.value,
      status: selectedDonation?.status || 'Pending',
      notes: formElements.notes.value,
    };

    if (selectedDonation) {
      setDonations(donations.map(donation =>
        donation.id === selectedDonation.id ? donationData : donation
      ));
    } else {
      setDonations([...donations, donationData]);
    }
    setOpenDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Rejected':
        return 'error';
      case 'Distributed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusActions = (donation: Donation) => {
    switch (donation.status) {
      case 'Pending':
        return (
          <>
            <IconButton
              size="small"
              onClick={() => handleStatusChange(donation.id, 'Accepted')}
              color="success"
              title="Accept"
            >
              <CheckCircleIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleStatusChange(donation.id, 'Rejected')}
              color="error"
              title="Reject"
            >
              <CancelIcon />
            </IconButton>
          </>
        );
      case 'Accepted':
        return (
          <IconButton
            size="small"
            onClick={() => handleStatusChange(donation.id, 'Distributed')}
            color="info"
            title="Mark as Distributed"
          >
            <LocalShippingIcon />
          </IconButton>
        );
      default:
        return null;
    }
  };

  const totalDonations = donations.length;
  const pendingDonations = donations.filter(d => d.status === 'Pending').length;
  const acceptedDonations = donations.filter(d => d.status === 'Accepted').length;
  const distributedDonations = donations.filter(d => d.status === 'Distributed').length;

  const DonationTable = ({ donations }: { donations: Donation[] }) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Donor Name</TableCell>
            <TableCell>Food Items</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Donation Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {donations.map((donation) => (
            <TableRow key={donation.id}>
              <TableCell>{donation.donorName}</TableCell>
              <TableCell>{donation.foodItems}</TableCell>
              <TableCell>{donation.quantity}</TableCell>
              <TableCell>{donation.unit}</TableCell>
              <TableCell>{new Date(donation.donationDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Chip
                  label={donation.status}
                  color={getStatusColor(donation.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{donation.notes || '-'}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {getStatusActions(donation)}
                  <IconButton
                    size="small"
                    onClick={() => handleEditDonation(donation)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteDonation(donation.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Donations Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddDonation}
        >
          Add Donation
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Donations
              </Typography>
              <Typography variant="h4">
                {totalDonations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4" color="warning.main">
                {pendingDonations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Accepted
              </Typography>
              <Typography variant="h4" color="success.main">
                {acceptedDonations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Distributed
              </Typography>
              <Typography variant="h4" color="info.main">
                {distributedDonations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All Donations" />
          <Tab label="Pending" />
          <Tab label="Accepted" />
          <Tab label="Rejected" />
          <Tab label="Distributed" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <DonationTable donations={donations} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <DonationTable donations={donations.filter(d => d.status === 'Pending')} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <DonationTable donations={donations.filter(d => d.status === 'Accepted')} />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <DonationTable donations={donations.filter(d => d.status === 'Rejected')} />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <DonationTable donations={donations.filter(d => d.status === 'Distributed')} />
        </TabPanel>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedDonation ? 'Edit Donation' : 'Add Donation'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="donorName"
              label="Donor Name"
              defaultValue={selectedDonation?.donorName}
              fullWidth
              required
            />
            <TextField
              name="foodItems"
              label="Food Items"
              defaultValue={selectedDonation?.foodItems}
              fullWidth
              required
            />
            <TextField
              name="quantity"
              label="Quantity"
              type="number"
              defaultValue={selectedDonation?.quantity}
              fullWidth
              required
            />
            <TextField
              name="unit"
              label="Unit"
              select
              defaultValue={selectedDonation?.unit || 'kg'}
              fullWidth
              required
            >
              <MenuItem value="kg">Kilograms (kg)</MenuItem>
              <MenuItem value="L">Liters (L)</MenuItem>
              <MenuItem value="units">Units</MenuItem>
              <MenuItem value="packets">Packets</MenuItem>
            </TextField>
            <TextField
              name="donationDate"
              label="Donation Date"
              type="date"
              defaultValue={selectedDonation?.donationDate || new Date().toISOString().split('T')[0]}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="notes"
              label="Notes"
              multiline
              rows={2}
              defaultValue={selectedDonation?.notes}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveDonation}
          >
            {selectedDonation ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DonationsManagement; 