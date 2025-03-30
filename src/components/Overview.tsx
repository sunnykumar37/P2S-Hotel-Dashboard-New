import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  IconButton
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Mock data for charts
const monthlyDonations = [
  { month: 'Jan', meals: 1200, ngos: 8 },
  { month: 'Feb', meals: 1500, ngos: 10 },
  { month: 'Mar', meals: 1800, ngos: 12 },
  { month: 'Apr', meals: 2000, ngos: 15 },
  { month: 'May', meals: 2200, ngos: 18 },
  { month: 'Jun', meals: 2500, ngos: 20 },
];

const foodCategories = [
  { name: 'Main Course', value: 45 },
  { name: 'Appetizers', value: 20 },
  { name: 'Desserts', value: 15 },
  { name: 'Beverages', value: 10 },
  { name: 'Others', value: 10 },
];

const deliveryPerformance = [
  { time: '08:00', completed: 85, pending: 15 },
  { time: '10:00', completed: 75, pending: 25 },
  { time: '12:00', completed: 90, pending: 10 },
  { time: '14:00', completed: 95, pending: 5 },
  { time: '16:00', completed: 80, pending: 20 },
  { time: '18:00', completed: 70, pending: 30 },
];

const impactMetrics = [
  { month: 'Jan', meals: 1200, carbon: 240 },
  { month: 'Feb', meals: 1500, carbon: 300 },
  { month: 'Mar', meals: 1800, carbon: 360 },
  { month: 'Apr', meals: 2000, carbon: 400 },
  { month: 'May', meals: 2200, carbon: 440 },
  { month: 'Jun', meals: 2500, carbon: 500 },
];

const monthlyRevenueData = [
  { name: 'Jan', revenue: 45000, orders: 120 },
  { name: 'Feb', revenue: 52000, orders: 150 },
  { name: 'Mar', revenue: 48000, orders: 130 },
  { name: 'Apr', revenue: 58000, orders: 160 },
  { name: 'May', revenue: 62000, orders: 180 },
  { name: 'Jun', revenue: 55000, orders: 140 },
];

const popularItemsData = [
  { name: 'Grilled Chicken', orders: 450 },
  { name: 'Quinoa Bowl', orders: 380 },
  { name: 'Grilled Salmon', orders: 320 },
  { name: 'Fresh Salad', orders: 280 },
  { name: 'Steamed Vegetables', orders: 250 },
];

const orderStatusData = [
  { name: 'Delivered', value: 65 },
  { name: 'In Progress', value: 20 },
  { name: 'Pending', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const chartTypes = ['bar', 'line', 'scatter'] as const;

const Overview: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [revenueChartType, setRevenueChartType] = useState<(typeof chartTypes)[number]>('bar');
  const [itemsChartType, setItemsChartType] = useState<(typeof chartTypes)[number]>('bar');

  // Chart colors based on theme
  const chartColors = {
    primary: isDarkMode ? '#90caf9' : '#1976d2',
    secondary: isDarkMode ? '#ce93d8' : '#9c27b0',
    background: isDarkMode ? '#1e1e1e' : '#fff',
    text: isDarkMode ? '#fff' : '#333',
    grid: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  };

  const handleChartTypeChange = (setter: React.Dispatch<React.SetStateAction<(typeof chartTypes)[number]>>, direction: 'next' | 'prev') => {
    setter(current => {
      const currentIndex = chartTypes.indexOf(current);
      if (direction === 'next') {
        return chartTypes[(currentIndex + 1) % chartTypes.length];
      } else {
        return chartTypes[(currentIndex - 1 + chartTypes.length) % chartTypes.length];
      }
    });
  };

  const renderRevenueChart = () => {
    switch (revenueChartType) {
      case 'bar':
        return (
          <BarChart data={monthlyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis dataKey="name" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
            <YAxis yAxisId="left" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
            <YAxis yAxisId="right" orientation="right" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
            <Tooltip contentStyle={{ backgroundColor: chartColors.background, border: 'none', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill={chartColors.primary} name="Revenue ($)" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="orders" fill={chartColors.secondary} name="Orders" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={monthlyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis dataKey="name" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
            <YAxis yAxisId="left" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
            <YAxis yAxisId="right" orientation="right" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
            <Tooltip contentStyle={{ backgroundColor: chartColors.background, border: 'none', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke={chartColors.primary} strokeWidth={2} dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }} name="Revenue ($)" />
            <Line yAxisId="right" type="monotone" dataKey="orders" stroke={chartColors.secondary} strokeWidth={2} dot={{ fill: chartColors.secondary, strokeWidth: 2, r: 4 }} name="Orders" />
          </LineChart>
        );
      case 'scatter':
        return (
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis 
              dataKey="name" 
              type="category" 
              name="Month" 
              stroke={chartColors.text}
              tick={{ fill: chartColors.text }}
            />
            <YAxis 
              yAxisId="left" 
              type="number" 
              dataKey="revenue" 
              name="Revenue" 
              stroke={chartColors.text}
              tick={{ fill: chartColors.text }}
              label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              type="number" 
              dataKey="orders" 
              name="Orders" 
              stroke={chartColors.text}
              tick={{ fill: chartColors.text }}
              label={{ value: 'Orders', angle: 90, position: 'insideRight' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: chartColors.background,
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Scatter 
              yAxisId="left" 
              name="Revenue ($)" 
              data={monthlyRevenueData} 
              fill={chartColors.primary}
              shape="circle"
              strokeWidth={1}
              stroke={chartColors.text}
              r={8}
            />
            <Scatter 
              yAxisId="right" 
              name="Orders" 
              data={monthlyRevenueData} 
              fill={chartColors.secondary}
              shape="circle"
              strokeWidth={1}
              stroke={chartColors.text}
              r={8}
            />
          </ScatterChart>
        );
      default:
        return null;
    }
  };

  const renderItemsChart = () => {
    switch (itemsChartType) {
      case 'bar':
        return (
          <BarChart data={popularItemsData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis dataKey="name" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
            <YAxis stroke={chartColors.text} tick={{ fill: chartColors.text }} />
            <Tooltip contentStyle={{ backgroundColor: chartColors.background, border: 'none', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Bar dataKey="orders" fill={chartColors.primary} name="Orders" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={popularItemsData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis dataKey="name" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
            <YAxis stroke={chartColors.text} tick={{ fill: chartColors.text }} />
            <Tooltip contentStyle={{ backgroundColor: chartColors.background, border: 'none', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke={chartColors.primary} strokeWidth={2} dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }} name="Orders" />
          </LineChart>
        );
      case 'scatter':
        return (
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis 
              dataKey="name" 
              type="category" 
              name="Item" 
              stroke={chartColors.text}
              tick={{ fill: chartColors.text }}
            />
            <YAxis 
              type="number" 
              dataKey="orders" 
              name="Orders" 
              stroke={chartColors.text}
              tick={{ fill: chartColors.text }}
              label={{ value: 'Orders', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: chartColors.background,
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Scatter 
              name="Orders" 
              data={popularItemsData} 
              fill={chartColors.primary}
              shape="circle"
              strokeWidth={1}
              stroke={chartColors.text}
              r={8}
            />
          </ScatterChart>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, color: chartColors.text }}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: theme.palette.background.paper }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Meals Donated
              </Typography>
              <Typography variant="h4">11,200</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: theme.palette.background.paper }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active NGO Partners
              </Typography>
              <Typography variant="h4">20</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: theme.palette.background.paper }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Carbon Footprint Reduced
              </Typography>
              <Typography variant="h4">2,240 kg</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: theme.palette.background.paper }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4">95%</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '400px',
              borderRadius: '20px',
              bgcolor: theme.palette.background.paper,
              background: isDarkMode 
                ? 'linear-gradient(to bottom right, #1e1e1e, #2d2d2d)'
                : 'linear-gradient(to bottom right, #ffffff, #f8f9fa)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: chartColors.text, fontWeight: 500 }}>
                Monthly Revenue & Orders
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={() => handleChartTypeChange(setRevenueChartType, 'prev')} size="small">
                  <ArrowBackIosNewIcon />
                </IconButton>
                <Typography variant="body2" sx={{ minWidth: '60px', textAlign: 'center' }}>
                  {revenueChartType.charAt(0).toUpperCase() + revenueChartType.slice(1)}
                </Typography>
                <IconButton onClick={() => handleChartTypeChange(setRevenueChartType, 'next')} size="small">
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>
            </Box>
            <ResponsiveContainer width="100%" height="90%">
              {renderRevenueChart()}
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Order Status Chart */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '400px',
              borderRadius: '20px',
              bgcolor: theme.palette.background.paper,
              background: isDarkMode 
                ? 'linear-gradient(to bottom right, #1e1e1e, #2d2d2d)'
                : 'linear-gradient(to bottom right, #ffffff, #f8f9fa)'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: chartColors.text, fontWeight: 500 }}>
              Order Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: chartColors.background,
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{
                    paddingTop: '20px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Popular Items Chart */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '400px',
              borderRadius: '20px',
              bgcolor: theme.palette.background.paper,
              background: isDarkMode 
                ? 'linear-gradient(to bottom right, #1e1e1e, #2d2d2d)'
                : 'linear-gradient(to bottom right, #ffffff, #f8f9fa)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: chartColors.text, fontWeight: 500 }}>
                Popular Menu Items
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={() => handleChartTypeChange(setItemsChartType, 'prev')} size="small">
                  <ArrowBackIosNewIcon />
                </IconButton>
                <Typography variant="body2" sx={{ minWidth: '60px', textAlign: 'center' }}>
                  {itemsChartType.charAt(0).toUpperCase() + itemsChartType.slice(1)}
                </Typography>
                <IconButton onClick={() => handleChartTypeChange(setItemsChartType, 'next')} size="small">
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>
            </Box>
            <ResponsiveContainer width="100%" height="90%">
              {renderItemsChart()}
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Monthly Donations Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Donations
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyDonations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="meals" fill={theme.palette.primary.main} name="Meals" />
                <Bar yAxisId="right" dataKey="ngos" fill={theme.palette.secondary.main} name="NGOs" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Delivery Performance Area Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Daily Delivery Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={deliveryPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="1"
                  stroke={theme.palette.success.main}
                  fill={theme.palette.success.light}
                  name="Completed"
                />
                <Area
                  type="monotone"
                  dataKey="pending"
                  stackId="1"
                  stroke={theme.palette.warning.main}
                  fill={theme.palette.warning.light}
                  name="Pending"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Impact Metrics Line Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Environmental Impact
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={impactMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="meals"
                  stroke={theme.palette.primary.main}
                  name="Meals Donated"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="carbon"
                  stroke={theme.palette.success.main}
                  name="Carbon Reduction (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview; 