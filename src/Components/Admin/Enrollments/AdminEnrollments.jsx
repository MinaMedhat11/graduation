import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Stack,
  CircularProgress,
  Snackbar,
  Alert
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
import Loading from './../../Loading/Loading';

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
  const { onSearchChange, searchTerm, onRefresh } = props;
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
          <IconButton onClick={onRefresh}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Toolbar>
  );
}

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: null, text: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    nextPageUrl: null,
    prevPageUrl: null
  });

  // Fetch enrollments from API
  const fetchEnrollments = async (url = 'http://127.0.0.1:8000/api/enrollments') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('API Response:', response.data);
      
      const { data } = response.data;
      
      // Set enrollments data
      setEnrollments(data.data.map(item => ({
        id: item.id,
        studentName: item.student_name,
        course: item.course_name,
        // Default or not available values
        instructor: 'Not Available',
        amount: `${item.course_price.toFixed(2)} EGP`,
        paymentMethod: 'Online Payment',
        status: item.status,
        date: new Date().toISOString().split('T')[0] // Today's date
      })));
      
      // Set pagination data
      setPagination({
        currentPage: data.current_page,
        lastPage: data.last_page,
        nextPageUrl: data.next_page_url,
        prevPageUrl: data.prev_page_url
      });
      
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      setError('Failed to load enrollments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch enrollments on component mount
  useEffect(() => {
    fetchEnrollments();
  }, []);

  // Show status message when it changes
  useEffect(() => {
    if (statusMessage.text) {
      setSnackbarOpen(true);
    }
  }, [statusMessage]);

  // Filtering logic
  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (enrollment.instructor && enrollment.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAccept = async (id) => {
    try {
      setProcessingId(id);
      const token = localStorage.getItem('token');
      
      // Call the API to accept the enrollment
      const response = await axios.get(
        `http://127.0.0.1:8000/api/enrollments/accept-student/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Accept API Response:', response.data);
      
      // Update local state for instant UI feedback
      setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: 'Done' } : e));
      
      // Show success message
      setStatusMessage({ 
        type: 'success', 
        text: response.data.message || 'Student enrollment accepted successfully'
      });
      
      // Refresh the list to get updated data
      fetchEnrollments();
      
    } catch (err) {
      console.error('Error accepting enrollment:', err);
      
      // Show error message
      setStatusMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to accept enrollment. Please try again.'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setProcessingId(id);
      const token = localStorage.getItem('token');
      
      // Call the API to reject the enrollment
      const response = await axios.get(
        `http://127.0.0.1:8000/api/enrollments/reject-student/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Reject API Response:', response.data);
      
      // Update local state for instant UI feedback
      setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: 'Rejected' } : e));
      
      // Show success message
      setStatusMessage({ 
        type: 'success', 
        text: response.data.message || 'Student enrollment rejected successfully'
      });
      
      // Refresh the list to get updated data
      fetchEnrollments();
      
    } catch (err) {
      console.error('Error rejecting enrollment:', err);
      
      // Show error message
      setStatusMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to reject enrollment. Please try again.'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handlePrevPage = () => {
    if (pagination.prevPageUrl) {
      fetchEnrollments(pagination.prevPageUrl);
    }
  };

  const handleNextPage = () => {
    if (pagination.nextPageUrl) {
      fetchEnrollments(pagination.nextPageUrl);
    }
  };

  const handleRefresh = () => {
    fetchEnrollments();
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
          onRefresh={handleRefresh}
        />
        
        {loading ? (
          <Loading/>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
            <Button variant="contained" onClick={handleRefresh} sx={{ mt: 2 }}>
              Retry
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="adminEnrollmentsTableTitle">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: '#F9FAFB' } }}>
                  <TableCell>Student</TableCell>
                  <TableCell>Course</TableCell>
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
                  const isProcessing = processingId === row.id;
                  return (
                    <TableRow hover key={row.id}>
                      <TableCell>{row.studentName}</TableCell>
                      <TableCell>{row.course}</TableCell>
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
                              disabled={isProcessing}
                              sx={{ borderRadius: '6px' }}
                            >
                              {isProcessing ? 'Processing...' : 'Accept'}
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleReject(row.id)}
                              disabled={isProcessing}
                              sx={{ borderRadius: '6px' }}
                            >
                              {isProcessing ? 'Processing...' : 'Reject'}
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
        )}
        
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
            Page {pagination.currentPage} of {pagination.lastPage}
          </Typography>
          <Box>
            <IconButton 
              onClick={handlePrevPage} 
              size="small" 
              disabled={!pagination.prevPageUrl}
            >
              <ArrowBackIosNewIcon fontSize="inherit" />
            </IconButton>
            <IconButton 
              onClick={handleNextPage} 
              size="small" 
              disabled={!pagination.nextPageUrl}
            >
              <ArrowForwardIosIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Toolbar>
      </Paper>
      
      {/* Snackbar for displaying messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={statusMessage.type || 'info'} 
          sx={{ width: '100%' }}
        >
          {statusMessage.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}