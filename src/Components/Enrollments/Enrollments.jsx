import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';

// Icons
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'; // Title icon
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Done / Accept
import CancelIcon from '@mui/icons-material/Cancel'; // Rejected
import PendingIcon from '@mui/icons-material/Pending'; // Pending
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; // Pending status icon in row
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh'; // Filter icon in image?

// Mock Data
const enrollmentsData = [
  { id: 1, studentName: 'Ziad Mohamed', course: 'Advanced Course in Networks', amount: '150.00 EGP', paymentMethod: 'Online Payment', status: 'Pending' },
  { id: 2, studentName: 'Ziad Mohamed', course: 'Advanced Course in Networks', amount: '1800.00 EGP', paymentMethod: 'Cash', status: 'Pending' },
  { id: 3, studentName: 'Ziad Mohamed', course: 'Advanced Course in Networks', amount: '00.00 EGP', paymentMethod: 'Online Payment', status: 'Rejected' },
  { id: 4, studentName: 'Ziad Mohamed', course: 'Advanced Course in Networks', amount: '00.00 EGP', paymentMethod: 'Online Payment', status: 'Rejected' },
  { id: 5, studentName: 'Ziad Mohamed', course: 'Advanced Course in Networks', amount: '150.00 EGP', paymentMethod: 'Online Payment', status: 'Done' },
  { id: 6, studentName: 'Ziad Mohamed', course: 'Advanced Course in Networks', amount: '1800.00 EGP', paymentMethod: 'Cash', status: 'Done' },
  { id: 7, studentName: 'Leslie Alexander', course: 'Flutter Basics', amount: '50.00 EGP', paymentMethod: 'Online Payment', status: 'Done' },
  { id: 8, studentName: 'Ahmed Ali', course: 'Advanced C++ Course', amount: '120.00 EGP', paymentMethod: 'Cash', status: 'Pending' },
];

// Helper to get status chip props
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

// Table Toolbar Component (similar to Courses page)
function EnrollmentsTableToolbar(props) {
  const { onSearchChange, searchTerm } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e0e0e0'
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%', fontWeight: 'bold' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Students
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by Student Name...."
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

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState(enrollmentsData); // Use mock data initially
  const [searchTerm, setSearchTerm] = useState('');

  // Add useEffect for actual data fetching here if needed

  // Filtering logic
  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAccept = (id) => {
    console.log('Accept enrollment:', id);
    // Add logic to update enrollment status via API and refresh/update state
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: 'Done' } : e));
  };

  const handleReject = (id) => {
    console.log('Reject enrollment:', id);
    // Add logic to update enrollment status via API and refresh/update state
     setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: 'Rejected' } : e));
  };

   const handlePrevPage = () => {
       console.log('Previous Page');
       // Add pagination logic if needed
   };

   const handleNextPage = () => {
       console.log('Next Page');
       // Add pagination logic if needed
   };


  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2, fontWeight: 'bold' }}>
        <PeopleAltIcon sx={{ mr: 1 }} /> Enrollments
      </Typography>

      <Paper sx={{ width: '100%', mb: 2, borderRadius: '12px', overflow: 'hidden' }}>
        <EnrollmentsTableToolbar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="enrollmentsTableTitle">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: '#F9FAFB' } }}>
                <TableCell>Student Name</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Methods</TableCell>
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
                    <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center' }}>
                         {row.status?.toLowerCase() === 'pending' ? <HourglassEmptyIcon color="warning" sx={{ mr: 1 }} /> : null}
                         {row.status?.toLowerCase() === 'rejected' ? <CancelIcon color="error" sx={{ mr: 1 }} /> : null}
                         {row.status?.toLowerCase() === 'done' ? <CheckCircleIcon color="success" sx={{ mr: 1 }} /> : null}
                        {row.studentName}
                    </TableCell>
                    <TableCell>{row.course}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.paymentMethod}</TableCell>
                    <TableCell>
                      <Chip
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
                        <Typography variant="caption" color="text.secondary">-</Typography> // No actions for non-pending
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
               {filteredEnrollments.length === 0 && (
                   <TableRow>
                       <TableCell colSpan={6} align="center">No enrollments found.</TableCell>
                   </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Add Pagination Controls if needed - design doesn't explicitly show pagination numbers but has arrows */}
         <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e0e0e0' }}>
              <IconButton onClick={handlePrevPage} size="small"><ArrowBackIosNewIcon fontSize="inherit" /></IconButton>
              <IconButton onClick={handleNextPage} size="small"><ArrowForwardIosIcon fontSize="inherit" /></IconButton>
         </Toolbar>
      </Paper>
    </Box>
  );
} 