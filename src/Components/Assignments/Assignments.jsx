import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Card from '@mui/material/Card';

// Icons
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Done
import PendingActionsIcon from '@mui/icons-material/PendingActions'; // Pending
import HourglassTopIcon from '@mui/icons-material/HourglassTop'; // Progress
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// Custom TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`assignment-tabpanel-${index}`}
      aria-labelledby={`assignment-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}> {/* Add padding top to separate from tabs */}
          {children}
        </Box>
      )}
    </div>
  );
}

// Helper to get status chip color and icon
const getStatusProps = (status) => {
  switch (status?.toLowerCase()) {
    case 'done':
      return { color: 'success', icon: <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} /> };
    case 'pending':
      return { color: 'warning', icon: <PendingActionsIcon sx={{ fontSize: 16, mr: 0.5 }} /> };
    case 'progress':
      return { color: 'info', icon: <HourglassTopIcon sx={{ fontSize: 16, mr: 0.5 }} /> };
    default:
      return { color: 'default', icon: null };
  }
};

export default function Assignments() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0); // 0 for Assignment, 1 for Quiz
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('Advanced Course In Networks'); // Example initial course
  const [courses] = useState(['Advanced Course In Networks', 'Advanced C++ Course', 'Flutter Basics']); // Mock course list

  // Fetching logic would go here, using useEffect
  useEffect(() => {
    // Fetch Assignments
    const fetchAssignments = async () => {
        // Replace with actual API call
        const mockAssignments = [
          { id: 1, title: 'Create LAN Network', course: 'Advanced Course In Networks', deadline: '12/1/2024', status: 'Progress' },
          { id: 2, title: 'oop training', course: 'Advanced C++ Course', deadline: '11/28/2024', status: 'Progress' },
          { id: 3, title: 'Create App', course: 'Advanced C++ Course', deadline: '12/19/2024', status: 'Pending' },
          { id: 4, title: 'Create Local Network', course: 'Advanced Course In Networks', deadline: '12/6/2024', status: 'Pending' },
          { id: 5, title: 'IP address training', course: 'Advanced Course In Networks', deadline: '12/4/2024', status: 'Done' },
          { id: 6, title: 'Data Types', course: 'Advanced C++ Course', deadline: '12/1/2024', status: 'Done' },
          { id: 7, title: 'Network Layers', course: 'Advanced Course In Networks', deadline: '11/27/2024', status: 'Done' },
        ];
        setAssignments(mockAssignments);
    };

    // Fetch Quizzes
    const fetchQuizzes = async () => {
        // Replace with actual API call
        const mockQuizzes = [
            { id: 1, title: 'Create LAN Network', course: 'Advanced Course In Networks', date: '12/1/2024', degree: '8/10' },
            { id: 2, title: 'IP address training', course: 'Advanced Course In Networks', date: '11/28/2024', degree: '9/10' },
            { id: 3, title: 'IP address training', course: 'Advanced C++ Course', date: '12/19/2024', degree: '2/10' },
            { id: 4, title: 'Create Local Network', course: 'Advanced Course In Networks', date: '12/6/2024', degree: '10/10' },
            { id: 5, title: 'IP address training', course: 'Advanced C++ Course', date: '12/4/2024', degree: '8/10' },
            { id: 6, title: 'Data Types', course: 'Advanced C++ Course', date: '12/1/2024', degree: '5/10' },
            { id: 7, title: 'Network Layers', course: 'Advanced Course In Networks', date: '11/27/2024', degree: '4/10' },
        ];
        setQuizzes(mockQuizzes);
    };

    fetchAssignments();
    fetchQuizzes();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCourseChange = (event) => {
      setSelectedCourse(event.target.value);
      // Potentially refetch assignments/quizzes based on the new course
  };

  const handleAddAssignment = () => {
    console.log("Add Assignment/Quiz clicked");
    // Navigate to Add Assignment/Quiz page or open modal
  }

  // Filter data based on selected course
  const filteredAssignments = assignments.filter(a => a.course === selectedCourse);
  const filteredQuizzes = quizzes.filter(q => q.course === selectedCourse);

  return (
    <Box sx={{ width: '100%' }}>
        {/* Top Section: Course Selector and Drop Zone (Simplified based on images) */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Course Selector Card */}
            <Grid item xs={12} md={6}>
                 <Card sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: '#25cf9d', color: '#fff', borderRadius: '12px' }}>
                    <AssignmentIcon sx={{ mr: 2, fontSize: '2.5rem' }}/>
                     <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">My Courses</Typography>
                        {/* Simplified Select for now */}
                         <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                            {/* <InputLabel id="course-select-label" sx={{ color: '#fff'}}>Select Course</InputLabel> */}
                             <Select
                                labelId="course-select-label"
                                value={selectedCourse}
                                onChange={handleCourseChange}
                                sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '& .MuiSvgIcon-root': { color: '#fff' } }}
                             >
                                 {courses.map((courseName) => (
                                    <MenuItem key={courseName} value={courseName}>{courseName}</MenuItem>
                                 ))}
                             </Select>
                         </FormControl>
                     </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
                        <IconButton size="small" sx={{ color: '#fff' }}><ArrowBackIosNewIcon fontSize="inherit"/></IconButton>
                        <IconButton size="small" sx={{ color: '#fff' }}><ArrowForwardIosIcon fontSize="inherit"/></IconButton>
                    </Box>
                 </Card>
             </Grid>
             {/* Drop Assignment Card */}
              <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '2px dashed #ccc', borderRadius: '12px' }}>
                     <UploadFileIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                     <Typography variant="h6" gutterBottom>Please Drop Assignment Here</Typography>
                     <Typography variant="body2" color="text.secondary" gutterBottom>Or Click on the "Add" Button</Typography>
                     <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddAssignment} sx={{ mt: 1, backgroundColor: '#25cf9d', '&:hover': { backgroundColor: '#1da884' } }}>
                         Add
                     </Button>
                  </Card>
              </Grid>
         </Grid>

      {/* Tab and Table Section */}
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '12px' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pl: 2, pr: 1 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="Assignment and Quiz tabs">
            <Tab label="Assignment" icon={<AssignmentIcon />} iconPosition="start" id="assignment-tab-0" aria-controls="assignment-tabpanel-0" />
            <Tab label="Quiz" icon={<QuizIcon />} iconPosition="start" id="assignment-tab-1" aria-controls="assignment-tabpanel-1" />
          </Tabs>
          <Box>
            <IconButton size="small"><ArrowBackIosNewIcon fontSize="inherit"/></IconButton>
            <IconButton size="small"><ArrowForwardIosIcon fontSize="inherit"/></IconButton>
          </Box>
        </Box>

        {/* Assignment Tab Content */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table stickyHeader aria-label="assignments table">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                  <TableCell>Assignment</TableCell>
                  <TableCell>Deadline</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssignments.map((row) => {
                  const statusProps = getStatusProps(row.status);
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={`assign-${row.id}`}>
                      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                        {statusProps.icon}
                        {row.title}
                      </TableCell>
                      <TableCell>{row.deadline}</TableCell>
                      <TableCell>{row.course}</TableCell>
                      <TableCell>
                        <Chip label={row.status} color={statusProps.color} size="small" />
                      </TableCell>
                      <TableCell>
                        <Button variant="contained" size="small" onClick={() => navigate(`/assignment/submit/${row.id}`)} sx={{ backgroundColor: '#25cf9d', '&:hover': { backgroundColor: '#1da884' } }}>
                          {row.status === 'Done' || row.status === 'Graded' ? 'View' : 'Submit'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                 {filteredAssignments.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} align="center">No assignments found for this course.</TableCell>
                    </TableRow>
                 )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Quiz Tab Content */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table stickyHeader aria-label="quizzes table">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                  <TableCell>Quiz</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Degree</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuizzes.map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={`quiz-${row.id}`}>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.course}</TableCell>
                    <TableCell>{row.degree}</TableCell>
                  </TableRow>
                ))}
                 {filteredQuizzes.length === 0 && (
                     <TableRow>
                         <TableCell colSpan={4} align="center">No quizzes found for this course.</TableCell>
                     </TableRow>
                  )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </Box>
  );
} 