import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Toolbar,
  Tooltip,
  Chip,
  Stack
} from '@mui/material';

// Icons
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Mock data for admin enrollments
const enrollmentsData = [
  { id: 1, studentName: 'Ahmed Hassan', course: 'Advanced Web Development', instructor: 'Dr. Mohamed Ali', amount: '1200.00 EGP', paymentMethod: 'Credit Card', status: 'Pending', date: '2025-05-01' },
  { id: 2, studentName: 'Sara Ahmed', course: 'UI/UX Design Masterclass', instructor: 'Dr. Laila Mahmoud', amount: '950.00 EGP', paymentMethod: 'PayPal', status: 'Done', date: '2025-04-28' },
  { id: 3, studentName: 'Omar Khaled', course: 'Machine Learning Basics', instructor: 'Dr. Ahmed Farid', amount: '1500.00 EGP', paymentMethod: 'Bank Transfer', status: 'Rejected', date: '2025-05-03' },
  { id: 4, studentName: 'Nour Mohamed', course: 'Mobile App Development', instructor: 'Dr. Hossam Samir', amount: '1100.00 EGP', paymentMethod: 'Credit Card', status: 'Done', date: '2025-04-25' },
  { id: 5, studentName: 'Yasmine Ali', course: 'Data Science Fundamentals', instructor: 'Dr. Mohamed Ali', amount: '1350.00 EGP', paymentMethod: 'Online Payment', status: 'Pending', date: '2025-05-05' },
  { id: 6, studentName: 'Karim Mostafa', course: 'Cyber Security Essentials', instructor: 'Dr. Ahmed Farid', amount: '1700.00 EGP', paymentMethod: 'PayPal', status: 'Done', date: '2025-04-20' },
  { id: 7, studentName: 'Heba Sayed', course: 'Advanced Database Design', instructor: 'Dr. Hossam Samir', amount: '1250.00 EGP', paymentMethod: 'Bank Transfer', status: 'Pending', date: '2025-05-07' }
];

// Helper for status chip properties
const getStatusProps = (status) => {
  switch (status?.toLowerCase()) {
    case 'done':
      return { color: 'success', icon: <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />, label: 'Done' };
    case 'pending':
      return { color: 'warning', icon: <PendingIcon sx={{ fontSize: 16, mr: 0.5 }} />, label: 'Pending' };
    case 'rejected':
      return { color: 'error', icon: <CancelIcon sx={{ fontSize: 16, mr: 0.5 }} />, label: 'Rejected' };
    default:
      return { color: 'default', icon: null, label: status };
  }
};

// Admin enrollments toolbar
function EnrollmentsTableToolbar(props) {
  const { onSearchChange, searchTerm } = props;

  return (
    <Toolbar sx={{ pl: 2, pr: 1, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e0e0e0' }}>
      <Typography variant="h6" id="tableTitle" component="div" sx={{ fontWeight: 'bold' }}>
        Enrollment Management
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search enrollments..."
          value={searchTerm}
          onChange={onSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'action.active' }} />
              </InputAdornment>
            ),
            sx: { borderRadius: '8px', backgroundColor: '#F9FAFB' }
          }}
          sx={{ width: '300px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#E5E7EB' }}}}
        />
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Refresh">
          <IconButton>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Toolbar>
  );
}

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState(enrollmentsData);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering logic
  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAccept = (id) => {
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: 'Done' } : e));
  };

  const handleReject = (id) => {
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: 'Rejected' } : e));
  };

  const handlePrevPage = () => {
    console.log('Previous Page');
    // Add pagination logic
  };

  const handleNextPage = () => {
    console.log('Next Page');
    // Add pagination logic
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2, fontWeight: 'bold' }}>
        <PeopleAltOutlinedIcon sx={{ mr: 1 }} /> Enrollments
      </Typography>

      <Paper sx={{ width: '100%', mb: 2, borderRadius: '12px', overflow: 'hidden' }}>
        <EnrollmentsTableToolbar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="adminEnrollmentsTableTitle">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: '#F9FAFB' } }}>
                <TableCell>Student</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Instructor</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEnrollments.map((row) => {
                const statusProps = getStatusProps(row.status);
                const isPending = row.status?.toLowerCase() === 'pending';
                return (
                  <TableRow hover key={row.id}>
                    <TableCell>{row.studentName}</TableCell>
                    <TableCell>{row.course}</TableCell>
                    <TableCell>{row.instructor}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.paymentMethod}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>
                      <Chip
                        icon={statusProps.icon}
                        label={statusProps.label}
                        color={statusProps.color}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {isPending ? (
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleAccept(row.id)}
                            sx={{ borderRadius: '6px' }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleReject(row.id)}
                            sx={{ borderRadius: '6px' }}
                          >
                            Reject
                          </Button>
                        </Stack>
                      ) : (
                        <Typography variant="caption" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredEnrollments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">No enrollments found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e0e0e0' }}>
          <IconButton onClick={handlePrevPage} size="small"><ArrowBackIosNewIcon fontSize="inherit" /></IconButton>
          <IconButton onClick={handleNextPage} size="small"><ArrowForwardIosIcon fontSize="inherit" /></IconButton>
        </Toolbar>
      </Paper>
    </Box>
  );
}
