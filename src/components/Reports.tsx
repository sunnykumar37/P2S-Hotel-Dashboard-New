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
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const donationData = [
    { month: 'Jan', donations: 65, meals: 28 },
    { month: 'Feb', donations: 59, meals: 48 },
    { month: 'Mar', donations: 80, meals: 40 },
    { month: 'Apr', donations: 81, meals: 19 },
    { month: 'May', donations: 56, meals: 86 },
    { month: 'Jun', donations: 55, meals: 27 },
  ];

  const recentReports: ReportData[] = [
    {
      id: '1',
      name: 'Monthly Donation Summary',
      type: 'PDF',
      date: '2024-03-17',
      size: '1.2 MB',
    },
    {
      id: '2',
      name: 'NGO Distribution Report',
      type: 'CSV',
      date: '2024-03-16',
      size: '856 KB',
    },
    {
      id: '3',
      name: 'Inventory Status',
      type: 'PDF',
      date: '2024-03-15',
      size: '2.1 MB',
    },
  ];

  const generatePDF = (data: any) => {
    // Create a temporary element to hold the data
    const element = document.createElement('div');
    element.innerHTML = `
      <h1>Report: ${data.name}</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      <hr />
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;

    // Use html2canvas and jsPDF
    import('html2canvas').then(html2canvas => {
      html2canvas.default(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        import('jspdf').then(jsPDF => {
          const pdf = new jsPDF.default();
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${data.name.toLowerCase().replace(/\s+/g, '_')}.pdf`);
        });
      });
    });
  };

  const generateCSV = (data: any) => {
    // Convert data to CSV format
    const items = Array.isArray(data) ? data : [data];
    const replacer = (key: string, value: any) => value === null ? '' : value;
    const header = Object.keys(items[0]);
    const csv = [
      header.join(','),
      ...items.map(row => header.map(fieldName => 
        JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');

    // Create and download the file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, `${data.name.toLowerCase().replace(/\s+/g, '_')}.csv`);
    } else {
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `${data.name.toLowerCase().replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = (data: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${data.name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>${data.name}</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <hr />
            <pre>${JSON.stringify(data, null, 2)}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleShare = async (data: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.name,
          text: `Check out this report: ${data.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copy to clipboard
      const textArea = document.createElement('textarea');
      textArea.value = `${data.name}\n${window.location.href}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard!');
    }
  };

  const handleGenerateReport = (format: 'PDF' | 'CSV', reportData: any) => {
    const data = {
      ...reportData,
      reportType,
      dateRange,
      generatedAt: new Date().toISOString(),
    };

    switch (format) {
      case 'PDF':
        generatePDF(data);
        break;
      case 'CSV':
        generateCSV(data);
        break;
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const ngoDistribution = [
    { name: 'Food Banks', value: 35 },
    { name: 'Community Kitchens', value: 25 },
    { name: 'Shelters', value: 20 },
    { name: 'Others', value: 20 },
  ];

  const orderStatusData = [
    { name: 'Delivered', value: 60, color: '#2196F3' },
    { name: 'In Progress', value: 15, color: '#4CAF50' },
    { name: 'Pending', value: 25, color: '#FFC107' }
  ];

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

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
            onClick={() => handleGenerateReport('PDF', { name: 'Donation Trends', data: donationData })}
          >
            Generate PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<CsvIcon />}
            onClick={() => handleGenerateReport('CSV', { name: 'Donation Trends', data: donationData })}
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
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="donations"
                      stroke={theme.palette.primary.main}
                      name="Donations Received"
                    />
                    <Line
                      type="monotone"
                      dataKey="meals"
                      stroke={theme.palette.secondary.main}
                      name="Meals Distributed"
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
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </TextField>
                <TextField
                  label="Start Date"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
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
                  <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                  <TableCell>{report.size}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleGenerateReport('PDF', report)}>
                      <PdfIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleGenerateReport('CSV', report)}>
                      <CsvIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handlePrint(report)}>
                      <PrintIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleShare(report)}>
                      <ShareIcon />
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
                      data={ngoDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ngoDistribution.map((entry, index) => (
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
                    <Bar dataKey="donations" fill={theme.palette.primary.main} name="Donations Received" />
                    <Bar dataKey="meals" fill={theme.palette.secondary.main} name="Meals Distributed" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Status Distribution
              </Typography>
              <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => `${value}%`}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '4px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      formatter={(value: string) => (
                        <span style={{ color: '#fff', fontSize: '0.875rem' }}>{value}</span>
                      )}
                    />
                  </PieChart>
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