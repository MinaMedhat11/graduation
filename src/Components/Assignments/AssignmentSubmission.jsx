import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// Icons
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';

export default function AssignmentSubmission() {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [submissionText, setSubmissionText] = useState('');
    const [assignmentData, setAssignmentData] = useState({
        id: '',
        title: '',
        course: '',
        dueDate: '',
        points: 0,
        status: 'Not Submitted',
        instructions: '',
        course_id: null
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    
    // Add state for displaying API response messages
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Fetch assignment details when component loads
    useEffect(() => {
        const fetchAssignmentDetails = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                console.log("Token for fetching assignments:", token ? "Token exists" : "No token found");
                
                // Get assignments to find the specific one and its course_id
                const response = await axios.get('http://127.0.0.1:8000/api/assignment', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                console.log("API Response from assignments:", response.data);
                
                // Find the assignment and its course in the response data
                let foundAssignment = null;
                let foundCourse = null;
                
                response.data.data.forEach(course => {
                    const assignment = course.assignments.find(a => a.id.toString() === assignmentId);
                    if (assignment) {
                        foundAssignment = assignment;
                        foundCourse = course;
                    }
                });
                
                if (foundAssignment && foundCourse) {
                    console.log("Found assignment:", foundAssignment);
                    console.log("Found course:", foundCourse);
                    
                    setAssignmentData({
                        id: foundAssignment.id,
                        title: foundAssignment.title,
                        course: foundCourse.course_name,
                        dueDate: foundAssignment.due_date,
                        points: foundAssignment.points || 100,
                        status: 'Not Submitted', // Default status
                        instructions: foundAssignment.description,
                        course_id: foundCourse.course_id
                    });
                } else {
                    setError('Assignment not found');
                }
            } catch (err) {
                console.error('Error fetching assignment details:', err);
                setError('Failed to load assignment details');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchAssignmentDetails();
    }, [assignmentId]);

    const handleTextChange = (event) => {
        setSubmissionText(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            setSubmitLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.error("No token found in localStorage");
                setSnackbarMessage("Authentication error: No token found");
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }
            
            // Create submission data
            const submissionData = {
                submission_file: submissionText,
                course_id: parseInt(assignmentData.course_id),
                assignment_id: parseInt(assignmentData.id)
            };
            
            // Log submission data for debugging
            console.log("Token for submission:", token ? "Token exists" : "No token found");
            console.log("Submitting data:", submissionData);
            console.log("Submission endpoint:", 'http://127.0.0.1:8000/api/assignment/create-assignment');
            
            // API call to submit the assignment
            const response = await axios({
                method: 'post',
                url: 'http://127.0.0.1:8000/api/assignment/create-assignment',
                data: submissionData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log("API Response:", response);
            
            // Display the message from the API
            const message = response.data.message || 'Assignment submitted successfully!';
            setSnackbarMessage(message);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            
            setAssignmentData(prev => ({ ...prev, status: 'Submitted' }));
            
            // Navigate back after a short delay to allow the user to see the message
            setTimeout(() => {
                navigate(-1);
            }, 2000);
            
        } catch (err) {
            console.error('Error submitting assignment:', err);
            console.log('Error response:', err.response);
            
            // Extract error message from API response if available
            const errorMessage = err.response?.data?.message || 'Failed to submit assignment. Please try again.';
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleCancel = () => {
        navigate(-1); // Navigate back to the previous page
    };

    const getStatusChipColor = (status) => {
        switch (status) {
            case 'Submitted': return 'primary';
            case 'Graded': return 'success';
            case 'Late': return 'warning';
            case 'Not Submitted':
            default: return 'error';
        }
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography>Loading assignment details...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography color="error">{error}</Typography>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
                {/* Header */}
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={1} sx={{ mb: 2 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{assignmentData.title}</Typography>
                        <Typography variant="subtitle1" color="text.secondary">{assignmentData.course}</Typography>
                    </Box>
                    <Stack direction="column" spacing={0.5} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
                        <Typography variant="body2" color="text.secondary">Due: {new Date(assignmentData.dueDate).toLocaleDateString()}</Typography>
                        <Typography variant="body2" color="text.secondary">Points: {assignmentData.points}</Typography>
                        <Chip 
                            label={assignmentData.status}
                            color={getStatusChipColor(assignmentData.status)}
                            size="small" 
                            sx={{ mt: 0.5 }} />
                    </Stack>
                </Stack>
                <Divider sx={{ mb: 3 }} />
                {/* Instructions */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>Instructions</Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: '8px' }}>
                         <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{assignmentData.instructions}</Typography>
                    </Paper>
                </Box>
                {/* Submission Area */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>Your Submission</Typography>
                    
                    {/* Text Input */}
                    <TextField
                        label="Add Comments or Text Submission"
                        multiline
                        rows={6}
                        fullWidth
                        variant="outlined"
                        value={submissionText}
                        onChange={handleTextChange}
                        sx={{ mb: 3 }}
                    />
                </Box>
                {/* Debug Info - Can remove in production */}
                <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: '4px' }}>
                    <Typography variant="caption" component="div">Debug Info:</Typography>
                    <Typography variant="caption" component="div">Assignment ID: {assignmentData.id}</Typography>
                    <Typography variant="caption" component="div">Course ID: {assignmentData.course_id}</Typography>
                </Box>
                {/* Action Buttons */}
                <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
                    <Button 
                        variant="outlined" 
                        onClick={handleCancel}
                        startIcon={<CancelIcon />} 
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleSubmit}
                        disabled={submitLoading || assignmentData.status !== 'Not Submitted'} // Disable if already submitted or loading
                        startIcon={<SendIcon />} 
                    >
                        {submitLoading ? 'Submitting...' : 
                         assignmentData.status === 'Not Submitted' ? 'Submit Assignment' : 'Resubmit Assignment'} 
                    </Button>
                </Stack>
            </Paper>
            
            {/* Snackbar for displaying API messages */}
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}