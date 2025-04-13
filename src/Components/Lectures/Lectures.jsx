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
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

// Icons
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'; // Upcoming
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Attended/Done
import CancelIcon from '@mui/icons-material/Cancel'; // Missed/Cancelled
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import SchoolIcon from '@mui/icons-material/School';
import LaunchIcon from '@mui/icons-material/Launch';

// Mock Data
const lectureSchedule = [
  { id: 1, date: '12/13/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 39, status: 'upcoming' },
  { id: 2, date: '12/11/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 38, status: 'upcoming' },
  { id: 3, date: '12/8/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 37, status: 'missed' },
  { id: 4, date: '12/6/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 36, status: 'attended' },
  { id: 5, date: '12/3/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 35, status: 'missed' },
  { id: 6, date: '12/1/2024', duration: '06:00', course: 'Advanced Course In Networks', number: 34, status: 'attended' },
];

const courses = ['Advanced Course In Networks', 'Advanced C++ Course', 'Flutter Basics']; // Mock course list

// Helper to get status icon and row style
const getStatusProps = (status) => {
  switch (status?.toLowerCase()) {
    case 'upcoming':
      return { icon: <AccessTimeFilledIcon color="action" />, style: {} };
    case 'attended':
      return { icon: <CheckCircleIcon color="success" />, style: { backgroundColor: '#E8F5E9' } }; // Light green background
    case 'missed':
      return { icon: <CancelIcon color="error" />, style: { backgroundColor: '#FFEBEE' } }; // Light red background
    default:
      return { icon: null, style: {} };
  }
};

export default function Lectures() {
  const [selectedCourse, setSelectedCourse] = useState('Advanced Course In Networks');
  const [currentMonth, setCurrentMonth] = useState('12/2024'); // Example state for the month

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    // Add logic to fetch/filter lectures for the selected course if needed
  };

   const handlePrevMonth = () => {
     console.log('Previous Month');
     // Add logic to change month and fetch/filter data
   };

   const handleNextMonth = () => {
       console.log('Next Month');
       // Add logic to change month and fetch/filter data
   };

   const handleCheckLecture = () => {
     console.log('Check Online Lecture');
     // Add logic to check for live lecture
   };

   // Filter lectures based on selected course (if needed, mock data is already filtered)
   const filteredLectures = lectureSchedule.filter(l => l.course === selectedCourse);

  return (
    <Box sx={{ width: '100%' }}>
        {/* Top Row: Join Lecture & My Courses Cards */}
         <Grid container spacing={3} sx={{ mb: 3 }}>
             {/* Join Online Lecture Card */}
              <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#25cf9d', color: '#fff', borderRadius: '12px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                         <VideoCameraFrontIcon sx={{ mr: 1 }} />
                         <Typography variant="h6">Join Online Lecture</Typography>
                     </Box>
                     <Typography variant="body2">Click To Check If An Online Lecture Is Currently Running. Keep The Page Open, And It Will Do This Check Automatically.</Typography>
                     <Button
                         variant="contained"
                         onClick={handleCheckLecture}
                         startIcon={<LaunchIcon />}
                         sx={{ mt: 2, alignSelf: 'center', backgroundColor: '#fff', color: '#25cf9d', '&:hover': { backgroundColor: '#eee' }}}
                     >
                         Check
                     </Button>
                  </Card>
              </Grid>
              {/* My Courses Card (simplified) */}
              <Grid item xs={12} md={6}>
                   <Card sx={{ display: 'flex', alignItems: 'center', p: 2, height: '100%', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                       <SchoolIcon sx={{ mr: 2, fontSize: '2.5rem', color: '#25cf9d' }}/>
                       <Box sx={{ flexGrow: 1 }}>
                           <Typography variant="h6">My Courses</Typography>
                            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                                <Select
                                    value={selectedCourse}
                                    onChange={handleCourseChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Select Course' }}
                                    sx={{ color: '#333', '.MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' }, '& .MuiSvgIcon-root': { color: '#555' } }}
                                >
                                    <MenuItem value="" disabled>Select Your Course</MenuItem>
                                    {courses.map((courseName) => (
                                        <MenuItem key={courseName} value={courseName}>{courseName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                       </Box>
                       <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
                           <IconButton size="small"><ArrowBackIosNewIcon fontSize="inherit"/></IconButton>
                           <IconButton size="small"><ArrowForwardIosIcon fontSize="inherit"/></IconButton>
                       </Box>
                   </Card>
              </Grid>
          </Grid>

        {/* Lecture Schedule Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '12px' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Lecture Schedule {currentMonth}</Typography>
                <Box>
                    <IconButton onClick={handlePrevMonth} size="small"><ArrowBackIosNewIcon fontSize="inherit" /></IconButton>
                    <IconButton onClick={handleNextMonth} size="small"><ArrowForwardIosIcon fontSize="inherit" /></IconButton>
                </Box>
            </Box>
            <TableContainer>
                <Table stickyHeader aria-label="lecture schedule table">
                    <TableHead>
                         <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: '#F9FAFB' } }}>
                            <TableCell>Date</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Course</TableCell>
                            <TableCell>Number</TableCell>
                            {/* Status Icon column added implicitly by rendering in row */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                         {filteredLectures.map((row) => {
                             const statusProps = getStatusProps(row.status);
                             return (
                                <TableRow hover key={row.id} sx={statusProps.style}>
                                    <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center' }}>
                                        {statusProps.icon}
                                         <Box sx={{ ml: 1.5 }}>{row.date}</Box> {/* Add margin left for spacing */}
                                    </TableCell>
                                    <TableCell>{row.duration}</TableCell>
                                    <TableCell>{row.course}</TableCell>
                                    <TableCell>{row.number}</TableCell>
                                </TableRow>
                            );
                         })}
                        {filteredLectures.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No lectures scheduled for this course/month.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
             {/* Optional: Add TablePagination if needed */}
        </Paper>
    </Box>
  );
} 