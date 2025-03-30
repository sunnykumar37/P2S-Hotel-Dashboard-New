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
  MenuItem,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface Request {
  id: string;
  ngoName: string;
  requestDate: string;
  mealType: string;
  quantity: number;
  status: 'Pending' | 'Approved' | 'In Progress' | 'Completed' | 'Cancelled';
  urgency: 'Low' | 'Medium' | 'High';
  preferredDeliveryDate: string;
  notes?: string;
}

const RequestManagement: React.FC = () => {
  const theme = useTheme();
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      ngoName: 'Care Foundation',
      requestDate: '2024-03-15',
      mealType: 'Vegetarian',
      quantity: 100,
      status: 'Approved',
      urgency: 'Medium',
      preferredDeliveryDate: '2024-03-20',
      notes: 'Please ensure all meals are properly packaged',
    },
    {
      id: '2',
      ngoName: 'Hope Center',
      requestDate: '2024-03-16',
      mealType: 'Standard',
      quantity: 150,
      status: 'Pending',
      urgency: 'High',
      preferredDeliveryDate: '2024-03-21',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(req => req.status === 'Pending').length;
  const approvedRequests = requests.filter(req => req.status === 'Approved').length;
  const totalMealsRequested = requests.reduce((sum, req) => sum + req.quantity, 0);

  const handleAddRequest = () => {
    setSelectedRequest(null);
    setOpenDialog(true);
  };

  const handleEditRequest = (request: Request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const handleDeleteRequest = (requestId: string) => {
    setRequests(requests.filter(req => req.id !== requestId));
  };

  const handleSaveRequest = () => {
    const form = document.querySelector('form');
    const formElements = form?.elements as any;

    if (selectedRequest) {
      const updatedRequest = {
        ...selectedRequest,
        ngoName: formElements.ngoName.value,
        mealType: formElements.mealType.value,
        quantity: parseInt(formElements.quantity.value),
        status: formElements.status?.value || selectedRequest.status,
        urgency: formElements.urgency.value,
        preferredDeliveryDate: formElements.preferredDeliveryDate.value,
        notes: formElements.notes.value,
      };

      setRequests(requests.map(req =>
        req.id === selectedRequest.id ? updatedRequest : req
      ));
    } else {
      const newRequest: Request = {
        id: String(requests.length + 1),
        ngoName: formElements.ngoName.value,
        requestDate: new Date().toISOString().split('T')[0],
        mealType: formElements.mealType.value,
        quantity: parseInt(formElements.quantity.value),
        status: 'Pending',
        urgency: formElements.urgency.value,
        preferredDeliveryDate: formElements.preferredDeliveryDate.value,
        notes: formElements.notes.value,
      };
      setRequests([...requests, newRequest]);
    }
    setOpenDialog(false);
  };

  const handleStatusChange = (requestId: string, newStatus: Request['status']) => {
    setRequests(requests.map(req =>
      req.id === requestId ? { ...req, status: newStatus } : req
    ));
  };

  const handleUrgencyChange = (requestId: string, newUrgency: Request['urgency']) => {
    setRequests(requests.map(req =>
      req.id === requestId ? { ...req, urgency: newUrgency } : req
    ));
  };

  const getStatusColor = (status: Request['status']) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'In Progress':
        return 'info';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getUrgencyColor = (urgency: Request['urgency']) => {
    switch (urgency) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'info';
      default:
        return 'default';
    }
  };

  // Add quick action buttons for status changes
  const QuickActionButtons = ({ request }: { request: Request }) => (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {request.status === 'Pending' && (
        <Button
          size="small"
          variant="contained"
          color="success"
          onClick={() => handleStatusChange(request.id, 'Approved')}
        >
          Approve
        </Button>
      )}
      {(request.status === 'Pending' || request.status === 'Approved') && (
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={() => handleStatusChange(request.id, 'Cancelled')}
        >
          Cancel
        </Button>
      )}
      {request.status === 'Approved' && (
        <Button
          size="small"
          variant="contained"
          color="info"
          onClick={() => handleStatusChange(request.id, 'In Progress')}
        >
          Start
        </Button>
      )}
      {request.status === 'In Progress' && (
        <Button
          size="small"
          variant="contained"
          color="success"
          onClick={() => handleStatusChange(request.id, 'Completed')}
        >
          Complete
        </Button>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Request Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddRequest}
        >
          New Request
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Requests
              </Typography>
              <Typography variant="h4">
                {totalRequests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Requests
              </Typography>
              <Typography variant="h4" color="warning.main">
                {pendingRequests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Approved Requests
              </Typography>
              <Typography variant="h4" color="success.main">
                {approvedRequests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Meals Requested
              </Typography>
              <Typography variant="h4">
                {totalMealsRequested}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NGO Name</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Meal Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Urgency</TableCell>
              <TableCell>Preferred Delivery</TableCell>
              <TableCell>Quick Actions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow
                key={request.id}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    cursor: 'pointer',
                  },
                }}
              >
                <TableCell>{request.ngoName}</TableCell>
                <TableCell>{request.requestDate}</TableCell>
                <TableCell>{request.mealType}</TableCell>
                <TableCell>{request.quantity}</TableCell>
                <TableCell>
                  <Chip
                    label={request.status}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={request.urgency}
                    color={getUrgencyColor(request.urgency)}
                    size="small"
                    onClick={() => {
                      const newUrgency = request.urgency === 'High' ? 'Medium' : 
                        request.urgency === 'Medium' ? 'Low' : 'High';
                      handleUrgencyChange(request.id, newUrgency);
                    }}
                  />
                </TableCell>
                <TableCell>{request.preferredDeliveryDate}</TableCell>
                <TableCell>
                  <QuickActionButtons request={request} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditRequest(request)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteRequest(request.id)}
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedRequest ? 'Edit Request' : 'New Request'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="ngoName"
              label="NGO Name"
              defaultValue={selectedRequest?.ngoName}
              fullWidth
              required
            />
            <TextField
              name="mealType"
              label="Meal Type"
              select
              defaultValue={selectedRequest?.mealType || 'Standard'}
              fullWidth
              required
            >
              <MenuItem value="Standard">Standard</MenuItem>
              <MenuItem value="Vegetarian">Vegetarian</MenuItem>
              <MenuItem value="Halal">Halal</MenuItem>
              <MenuItem value="Kosher">Kosher</MenuItem>
            </TextField>
            <TextField
              name="quantity"
              label="Quantity"
              type="number"
              defaultValue={selectedRequest?.quantity}
              fullWidth
              required
            />
            <TextField
              name="preferredDeliveryDate"
              label="Preferred Delivery Date"
              type="date"
              defaultValue={selectedRequest?.preferredDeliveryDate}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="urgency"
              label="Urgency"
              select
              defaultValue={selectedRequest?.urgency || 'Medium'}
              fullWidth
              required
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>
            {selectedRequest && (
              <TextField
                name="status"
                label="Status"
                select
                defaultValue={selectedRequest.status}
                fullWidth
                required
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
            )}
            <TextField
              name="notes"
              label="Notes"
              defaultValue={selectedRequest?.notes}
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
            onClick={handleSaveRequest}
          >
            {selectedRequest ? 'Update' : 'Add'} Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestManagement; 