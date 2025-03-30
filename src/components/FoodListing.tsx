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
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface FoodItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  status: 'Available' | 'Low Stock' | 'Expired';
  notes?: string;
}

const FoodListing: React.FC = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);

  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    {
      id: '1',
      name: 'Rice',
      category: 'Grains',
      quantity: 100,
      unit: 'kg',
      expiryDate: '2024-06-30',
      status: 'Available',
      notes: 'Basmati rice',
    },
    {
      id: '2',
      name: 'Lentils',
      category: 'Pulses',
      quantity: 25,
      unit: 'kg',
      expiryDate: '2024-05-15',
      status: 'Low Stock',
      notes: 'Red lentils',
    },
    {
      id: '3',
      name: 'Cooking Oil',
      category: 'Oils',
      quantity: 50,
      unit: 'L',
      expiryDate: '2024-04-01',
      status: 'Available',
    },
  ]);

  const handleAddItem = () => {
    setSelectedItem(null);
    setOpenDialog(true);
  };

  const handleEditItem = (item: FoodItem) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setFoodItems(foodItems.filter(item => item.id !== itemId));
    }
  };

  const handleSaveItem = () => {
    const form = document.querySelector('form');
    const formElements = form?.elements as any;

    const itemData: FoodItem = {
      id: selectedItem?.id || String(foodItems.length + 1),
      name: formElements.name.value,
      category: formElements.category.value,
      quantity: Number(formElements.quantity.value),
      unit: formElements.unit.value,
      expiryDate: formElements.expiryDate.value,
      status: formElements.quantity.value <= 30 ? 'Low Stock' : 'Available',
      notes: formElements.notes.value,
    };

    if (selectedItem) {
      setFoodItems(foodItems.map(item =>
        item.id === selectedItem.id ? itemData : item
      ));
    } else {
      setFoodItems([...foodItems, itemData]);
    }
    setOpenDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const totalItems = foodItems.length;
  const lowStockItems = foodItems.filter(item => item.status === 'Low Stock').length;
  const expiredItems = foodItems.filter(item => item.status === 'Expired').length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Food Inventory
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddItem}
        >
          Add Food Item
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Items
              </Typography>
              <Typography variant="h4">
                {totalItems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Items
              </Typography>
              <Typography variant="h4" color="warning.main">
                {lowStockItems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Expired Items
              </Typography>
              <Typography variant="h4" color="error.main">
                {expiredItems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foodItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={item.status}
                    color={getStatusColor(item.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{item.notes || '-'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditItem(item)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteItem(item.id)}
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
          {selectedItem ? 'Edit Food Item' : 'Add Food Item'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Name"
              defaultValue={selectedItem?.name}
              fullWidth
              required
            />
            <TextField
              name="category"
              label="Category"
              select
              defaultValue={selectedItem?.category || 'Grains'}
              fullWidth
              required
            >
              <MenuItem value="Grains">Grains</MenuItem>
              <MenuItem value="Pulses">Pulses</MenuItem>
              <MenuItem value="Oils">Oils</MenuItem>
              <MenuItem value="Vegetables">Vegetables</MenuItem>
              <MenuItem value="Fruits">Fruits</MenuItem>
              <MenuItem value="Dairy">Dairy</MenuItem>
              <MenuItem value="Meat">Meat</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </TextField>
            <TextField
              name="quantity"
              label="Quantity"
              type="number"
              defaultValue={selectedItem?.quantity}
              fullWidth
              required
            />
            <TextField
              name="unit"
              label="Unit"
              select
              defaultValue={selectedItem?.unit || 'kg'}
              fullWidth
              required
            >
              <MenuItem value="kg">Kilograms (kg)</MenuItem>
              <MenuItem value="L">Liters (L)</MenuItem>
              <MenuItem value="units">Units</MenuItem>
              <MenuItem value="packets">Packets</MenuItem>
            </TextField>
            <TextField
              name="expiryDate"
              label="Expiry Date"
              type="date"
              defaultValue={selectedItem?.expiryDate || new Date().toISOString().split('T')[0]}
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
              defaultValue={selectedItem?.notes}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveItem}
          >
            {selectedItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FoodListing; 