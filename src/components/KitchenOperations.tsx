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
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

interface MealPreparation {
  id: string;
  mealType: string;
  quantity: number;
  status: string;
  startTime: string;
  estimatedCompletion: string;
  assignedTo: string;
  notes?: string;
  recipe?: string;
}

const KitchenOperations: React.FC = () => {
  const theme = useTheme();
  const [preparations, setPreparations] = useState<MealPreparation[]>([
    {
      id: '1',
      mealType: 'Lunch',
      quantity: 150,
      status: 'In Progress',
      startTime: '08:00',
      estimatedCompletion: '11:00',
      assignedTo: 'Chef John',
      recipe: 'Vegetable Biryani',
      notes: 'Include extra portions for dietary restrictions',
    },
    {
      id: '2',
      mealType: 'Dinner',
      quantity: 200,
      status: 'Scheduled',
      startTime: '14:00',
      estimatedCompletion: '17:00',
      assignedTo: 'Chef Sarah',
      recipe: 'Mixed Rice Bowl',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPrep, setSelectedPrep] = useState<MealPreparation | null>(null);

  const totalPreparations = preparations.length;
  const inProgress = preparations.filter(prep => prep.status === 'In Progress').length;
  const completed = preparations.filter(prep => prep.status === 'Completed').length;
  const scheduled = preparations.filter(prep => prep.status === 'Scheduled').length;

  const recipes = [
    'Vegetable Biryani',
    'Mixed Rice Bowl',
    'Pasta Primavera',
    'Lentil Curry',
    'Chicken Stew',
    'Vegetable Soup',
    'Rice and Beans',
    'Noodle Stir-fry'
  ];

  const chefs = [
    'Chef John',
    'Chef Sarah',
    'Chef Michael',
    'Chef Lisa',
    'Chef David'
  ];

  const handleAddPreparation = () => {
    setSelectedPrep(null);
    setOpenDialog(true);
  };

  const handleEditPreparation = (prep: MealPreparation) => {
    setSelectedPrep(prep);
    setOpenDialog(true);
  };

  const handleSavePreparation = (formData: Partial<MealPreparation>) => {
    const form = document.querySelector('form');
    const formElements = form?.elements as any;

    if (selectedPrep) {
      const updatedPrep = {
        ...selectedPrep,
        mealType: formElements.mealType.value,
        recipe: formElements.recipe.value,
        quantity: parseInt(formElements.quantity.value),
        startTime: formElements.startTime.value,
        estimatedCompletion: formElements.estimatedCompletion.value,
        assignedTo: formElements.assignedTo.value,
        status: formElements.status?.value || selectedPrep.status,
        notes: formElements.notes.value
      };

      setPreparations(preparations.map(prep =>
        prep.id === selectedPrep.id ? updatedPrep : prep
      ));
    } else {
      const newPrep: MealPreparation = {
        id: String(preparations.length + 1),
        mealType: formElements.mealType.value,
        recipe: formElements.recipe.value,
        quantity: parseInt(formElements.quantity.value),
        status: 'Scheduled',
        startTime: formElements.startTime.value,
        estimatedCompletion: formElements.estimatedCompletion.value,
        assignedTo: formElements.assignedTo.value,
        notes: formElements.notes.value
      };
      setPreparations([...preparations, newPrep]);
    }
    setOpenDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Scheduled':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Kitchen Operations
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPreparation}
        >
          New Preparation
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Preparations
              </Typography>
              <Typography variant="h4">{totalPreparations}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h4" color="warning.main">
                {inProgress}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4" color="success.main">
                {completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Scheduled
              </Typography>
              <Typography variant="h4" color="info.main">
                {scheduled}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Meal Type</TableCell>
              <TableCell>Recipe</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>Est. Completion</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preparations.map((prep) => (
              <TableRow
                key={prep.id}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    cursor: 'pointer',
                  },
                }}
              >
                <TableCell>{prep.mealType}</TableCell>
                <TableCell>{prep.recipe}</TableCell>
                <TableCell>{prep.quantity}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon fontSize="small" />
                    {prep.startTime}
                  </Box>
                </TableCell>
                <TableCell>{prep.estimatedCompletion}</TableCell>
                <TableCell>{prep.assignedTo}</TableCell>
                <TableCell>
                  <Chip
                    label={prep.status}
                    color={getStatusColor(prep.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditPreparation(prep)}>
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
          {selectedPrep ? 'Edit Preparation' : 'New Preparation'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              name="mealType"
              label="Meal Type"
              defaultValue={selectedPrep?.mealType || 'Lunch'}
              fullWidth
              required
            >
              <MenuItem value="Breakfast">Breakfast</MenuItem>
              <MenuItem value="Lunch">Lunch</MenuItem>
              <MenuItem value="Dinner">Dinner</MenuItem>
            </TextField>
            <TextField
              select
              name="recipe"
              label="Recipe"
              defaultValue={selectedPrep?.recipe || recipes[0]}
              fullWidth
              required
            >
              {recipes.map((recipe) => (
                <MenuItem key={recipe} value={recipe}>
                  {recipe}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="number"
              name="quantity"
              label="Quantity"
              defaultValue={selectedPrep?.quantity || 0}
              fullWidth
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                type="time"
                name="startTime"
                label="Start Time"
                defaultValue={selectedPrep?.startTime || '09:00'}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                type="time"
                name="estimatedCompletion"
                label="Estimated Completion"
                defaultValue={selectedPrep?.estimatedCompletion || '12:00'}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
            <TextField
              select
              name="assignedTo"
              label="Assigned To"
              defaultValue={selectedPrep?.assignedTo || chefs[0]}
              fullWidth
              required
            >
              {chefs.map((chef) => (
                <MenuItem key={chef} value={chef}>
                  {chef}
                </MenuItem>
              ))}
            </TextField>
            {selectedPrep && (
              <TextField
                select
                name="status"
                label="Status"
                defaultValue={selectedPrep.status}
                fullWidth
                required
              >
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
            )}
            <TextField
              name="notes"
              label="Notes"
              defaultValue={selectedPrep?.notes}
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
            onClick={() => handleSavePreparation({})}
          >
            {selectedPrep ? 'Update' : 'Add'} Preparation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KitchenOperations; 