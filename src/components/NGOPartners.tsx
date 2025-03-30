import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Avatar,
  Chip,
  useTheme,
  Tab,
  Tabs,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

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
      id={`ngo-tabpanel-${index}`}
      aria-labelledby={`ngo-tab-${index}`}
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

interface NGO {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  joinedDate: string;
  lastDonation: string;
  totalDonations: number;
  preferredMeals: string[];
  notes?: string;
}

const NGOPartners: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);

  const [ngos, setNGOs] = useState<NGO[]>([
    {
      id: '1',
      name: 'Care Foundation',
      contactPerson: 'John Smith',
      email: 'john@carefoundation.org',
      phone: '+1 234-567-8900',
      address: '123 Care Street, City, State 12345',
      status: 'Active',
      joinedDate: '2024-01-15',
      lastDonation: '2024-03-15',
      totalDonations: 1500,
      preferredMeals: ['Vegetarian', 'Halal'],
      notes: 'Regular weekly schedule',
    },
    {
      id: '2',
      name: 'Hope Center',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@hopecenter.org',
      phone: '+1 234-567-8901',
      address: '456 Hope Avenue, City, State 12345',
      status: 'Active',
      joinedDate: '2024-02-01',
      lastDonation: '2024-03-16',
      totalDonations: 1200,
      preferredMeals: ['Standard', 'Vegetarian'],
    },
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (ngo?: NGO) => {
    setSelectedNGO(ngo || null);
    setOpenDialog(true);
  };

  const activeNGOs = ngos.filter(ngo => ngo.status === 'Active').length;
  const totalDonations = ngos.reduce((sum, ngo) => sum + ngo.totalDonations, 0);
  const averageDonationsPerNGO = Math.round(totalDonations / ngos.length);

  const handleDeleteNGO = (ngoId: string) => {
    if (window.confirm('Are you sure you want to delete this NGO partner?')) {
      setNGOs(ngos.filter(ngo => ngo.id !== ngoId));
    }
  };

  const handleSaveNGO = () => {
    const form = document.querySelector('form');
    const formElements = form?.elements as any;

    if (selectedNGO) {
      const updatedNGO = {
        ...selectedNGO,
        name: formElements.name.value,
        contactPerson: formElements.contactPerson.value,
        email: formElements.email.value,
        phone: formElements.phone.value,
        address: formElements.address.value,
        status: formElements.status.value,
        preferredMeals: formElements.preferredMeals.value.split(','),
        notes: formElements.notes.value,
      };

      setNGOs(ngos.map(ngo =>
        ngo.id === selectedNGO.id ? updatedNGO : ngo
      ));
    } else {
      const newNGO: NGO = {
        id: String(ngos.length + 1),
        name: formElements.name.value,
        contactPerson: formElements.contactPerson.value,
        email: formElements.email.value,
        phone: formElements.phone.value,
        address: formElements.address.value,
        status: formElements.status.value,
        joinedDate: new Date().toISOString().split('T')[0],
        lastDonation: '-',
        totalDonations: 0,
        preferredMeals: formElements.preferredMeals.value.split(','),
        notes: formElements.notes.value,
      };
      setNGOs([...ngos, newNGO]);
    }
    setOpenDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'error';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          NGO Partners
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add NGO Partner
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active NGO Partners
              </Typography>
              <Typography variant="h4" color="success.main">
                {activeNGOs}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Meals Donated
              </Typography>
              <Typography variant="h4">
                {totalDonations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Donations per NGO
              </Typography>
              <Typography variant="h4">
                {averageDonationsPerNGO}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All Partners" />
            <Tab label="Active Partners" />
            <Tab label="Donation History" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>NGO Name</TableCell>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Contact Info</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined Date</TableCell>
                  <TableCell>Last Donation</TableCell>
                  <TableCell>Total Donations</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ngos.map((ngo) => (
                  <TableRow key={ngo.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar>{ngo.name[0]}</Avatar>
                        <Typography>{ngo.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{ngo.contactPerson}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon fontSize="small" />
                          <Typography variant="body2">{ngo.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon fontSize="small" />
                          <Typography variant="body2">{ngo.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ngo.status}
                        color={getStatusColor(ngo.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{ngo.joinedDate}</TableCell>
                    <TableCell>{ngo.lastDonation}</TableCell>
                    <TableCell>{ngo.totalDonations}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleOpenDialog(ngo)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteNGO(ngo.id)}
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
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Active Partners List
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>NGO Name</TableCell>
                  <TableCell>Preferred Meals</TableCell>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Contact Info</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ngos.filter(ngo => ngo.status === 'Active').map((ngo) => (
                  <TableRow key={ngo.id}>
                    <TableCell>{ngo.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {ngo.preferredMeals.map((meal, index) => (
                          <Chip
                            key={index}
                            label={meal}
                            size="small"
                            color="info"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>{ngo.contactPerson}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon fontSize="small" />
                          <Typography variant="body2">{ngo.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon fontSize="small" />
                          <Typography variant="body2">{ngo.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{ngo.notes}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleOpenDialog(ngo)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteNGO(ngo.id)}
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
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Donation History
          </Typography>
          {/* Donation history content */}
        </TabPanel>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedNGO ? 'Edit NGO Partner' : 'Add NGO Partner'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="NGO Name"
              defaultValue={selectedNGO?.name}
              fullWidth
              required
            />
            <TextField
              name="contactPerson"
              label="Contact Person"
              defaultValue={selectedNGO?.contactPerson}
              fullWidth
              required
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              defaultValue={selectedNGO?.email}
              fullWidth
              required
            />
            <TextField
              name="phone"
              label="Phone"
              defaultValue={selectedNGO?.phone}
              fullWidth
              required
            />
            <TextField
              name="address"
              label="Address"
              defaultValue={selectedNGO?.address}
              fullWidth
              required
              multiline
              rows={2}
            />
            <TextField
              name="preferredMeals"
              select
              label="Preferred Meals"
              defaultValue={selectedNGO?.preferredMeals || []}
              fullWidth
              SelectProps={{
                multiple: true,
              }}
            >
              <MenuItem value="Standard">Standard</MenuItem>
              <MenuItem value="Vegetarian">Vegetarian</MenuItem>
              <MenuItem value="Halal">Halal</MenuItem>
              <MenuItem value="Kosher">Kosher</MenuItem>
            </TextField>
            <TextField
              name="status"
              select
              label="Status"
              defaultValue={selectedNGO?.status || 'Active'}
              fullWidth
              required
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </TextField>
            <TextField
              name="notes"
              label="Notes"
              defaultValue={selectedNGO?.notes}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveNGO}
          >
            {selectedNGO ? 'Update' : 'Add'} Partner
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NGOPartners; 