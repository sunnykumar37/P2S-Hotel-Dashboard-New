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
  MenuItem,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  lastUpdated: string;
  status: string;
  minimumLevel: number;
}

const FoodInventory: React.FC = () => {
  const theme = useTheme();
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Rice',
      category: 'Grains',
      quantity: 100,
      unit: 'kg',
      lastUpdated: '2024-03-15',
      status: 'In Stock',
      minimumLevel: 50,
    },
    {
      id: '2',
      name: 'Vegetables',
      category: 'Fresh Produce',
      quantity: 25,
      unit: 'kg',
      lastUpdated: '2024-03-16',
      status: 'Low Stock',
      minimumLevel: 30,
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.quantity < item.minimumLevel).length;
  const categories = [...new Set(inventory.map(item => item.category))].length;

  const handleAddItem = () => {
    setSelectedItem(null);
    setOpenDialog(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleSaveItem = (formData: Partial<InventoryItem>) => {
    if (selectedItem) {
      setInventory(inventory.map(item =>
        item.id === selectedItem.id ? { ...item, ...formData } : item
      ));
    } else {
      const newItem: InventoryItem = {
        id: String(inventory.length + 1),
        name: formData.name || '',
        category: formData.category || '',
        quantity: formData.quantity || 0,
        unit: formData.unit || '',
        lastUpdated: new Date().toISOString().split('T')[0],
        status: formData.status || 'In Stock',
        minimumLevel: formData.minimumLevel || 0,
      };
      setInventory([...inventory, newItem]);
    }
    setOpenDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'error';
      default:
        return 'default';
    }
  };

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
          Add Item
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StyledCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Items
              </Typography>
              <Typography variant="h4">{totalItems}</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StyledCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Items
              </Typography>
              <Typography variant="h4" color="warning.main">
                {lowStockItems}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StyledCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Categories
              </Typography>
              <Typography variant="h4">{categories}</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow 
                key={item.id}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    cursor: 'pointer',
                  },
                }}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.quantity} {item.unit}
                    {item.quantity < item.minimumLevel && (
                      <WarningIcon color="warning" fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.lastUpdated}</TableCell>
                <TableCell>
                  <Chip
                    label={item.status}
                    color={getStatusColor(item.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditItem(item)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedItem ? 'Edit Item' : 'Add New Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Item Name"
              defaultValue={selectedItem?.name}
              fullWidth
              required
            />
            <TextField
              select
              label="Category"
              defaultValue={selectedItem?.category}
              fullWidth
              required
            >
              <MenuItem value="Grains">Grains</MenuItem>
              <MenuItem value="Fresh Produce">Fresh Produce</MenuItem>
              <MenuItem value="Dairy">Dairy</MenuItem>
              <MenuItem value="Meat">Meat</MenuItem>
              <MenuItem value="Spices">Spices</MenuItem>
            </TextField>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                type="number"
                label="Quantity"
                defaultValue={selectedItem?.quantity}
                fullWidth
                required
              />
              <TextField
                select
                label="Unit"
                defaultValue={selectedItem?.unit}
                fullWidth
                required
              >
                <MenuItem value="kg">Kilograms (kg)</MenuItem>
                <MenuItem value="g">Grams (g)</MenuItem>
                <MenuItem value="l">Liters (l)</MenuItem>
                <MenuItem value="pcs">Pieces (pcs)</MenuItem>
              </TextField>
            </Box>
            <TextField
              select
              label="Status"
              defaultValue={selectedItem?.status || 'In Stock'}
              fullWidth
              required
            >
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Low Stock">Low Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </TextField>
            <TextField
              type="number"
              label="Minimum Level"
              defaultValue={selectedItem?.minimumLevel}
              fullWidth
              required
              helperText="Alert will be shown when quantity falls below this level"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSaveItem({
              name: 'New Item',
              category: 'Grains',
              quantity: 0,
              unit: 'kg',
              minimumLevel: 0,
            })}
          >
            {selectedItem ? 'Update' : 'Add'} Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FoodInventory; 