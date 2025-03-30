import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

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

const StyledButton = styled(Button)(({ theme }) => ({
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

interface ReportData {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

const Reports: React.FC = () => {
  const theme = useTheme();
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState('last30');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);

  const donationData = [
    { month: 'Jan', meals: 1200, ngos: 8 },
    { month: 'Feb', meals: 1500, ngos: 10 },
    { month: 'Mar', meals: 1800, ngos: 12 },
    { month: 'Apr', meals: 2000, ngos: 15 },
    { month: 'May', meals: 2200, ngos: 18 },
    { month: 'Jun', meals: 2500, ngos: 20 },
  ];

  const recentReports: ReportData[] = [
    {
      id: '1',
      name: 'Monthly Donation Report - March 2024',
      type: 'PDF',
      date: '2024-03-01',
      size: '2.5 MB',
    },
    {
      id: '2',
      name: 'NGO Partnership Analysis Q1 2024',
      type: 'CSV',
      date: '2024-03-15',
      size: '1.8 MB',
    },
    {
      id: '3',
      name: 'Food Waste Reduction Report',
      type: 'PDF',
      date: '2024-03-10',
      size: '3.2 MB',
    },
  ];

  const handleGenerateReport = (format: 'pdf' | 'csv') => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      const newReportData = [
        { date: '2024-03-30', ngoName: 'Food Bank A', mealsCount: 50, status: 'Delivered', deliveryTime: '45 mins' },
        { date: '2024-03-30', ngoName: 'Community Kitchen B', mealsCount: 30, status: 'In Transit', deliveryTime: '30 mins' },
        { date: '2024-03-30', ngoName: 'Shelter C', mealsCount: 40, status: 'Delivered', deliveryTime: '35 mins' },
      ];
      setReportData(newReportData);
      setLoading(false);
    }, 1000);
  };

  const handleDownloadReport = (format: 'pdf' | 'csv') => {
    setLoading(true);
    // Simulating download
    setTimeout(() => {
      console.log(`Downloading report in ${format} format`);
      setLoading(false);
    }, 1000);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Reports & Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            onClick={() => handleGenerateReport('pdf')}
          >
            Generate PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<CsvIcon />}
            onClick={() => handleGenerateReport('csv')}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Donation Trends
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={donationData}>
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
                      dataKey="ngos"
                      stroke={theme.palette.secondary.main}
                      name="Active NGOs"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Report Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  select
                  label="Report Type"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="daily">Daily Report</MenuItem>
                  <MenuItem value="weekly">Weekly Report</MenuItem>
                  <MenuItem value="monthly">Monthly Report</MenuItem>
                  <MenuItem value="quarterly">Quarterly Report</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Date Range"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="last7">Last 7 Days</MenuItem>
                  <MenuItem value="last30">Last 30 Days</MenuItem>
                  <MenuItem value="last90">Last 90 Days</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </TextField>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Reports
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Report Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.name}</TableCell>
                  <TableCell>
                    {report.type === 'PDF' ? <PdfIcon color="error" /> : <CsvIcon color="primary" />}
                    {' '}
                    {report.type}
                  </TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.size}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <DownloadIcon />
                    </IconButton>
                    <IconButton size="small">
                      <ShareIcon />
                    </IconButton>
                    <IconButton size="small">
                      <PrintIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                NGO Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Food Banks', value: 35 },
                        { name: 'Community Kitchens', value: 25 },
                        { name: 'Shelters', value: 20 },
                        { name: 'Others', value: 20 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {donationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Performance
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={donationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="meals" fill={theme.palette.primary.main} name="Meals Donated" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports; 