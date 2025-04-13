import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Link from '@mui/material/Link'; // To make filenames clickable
import Grid from '@mui/material/Grid'; // Import Grid

// Icons
import DescriptionIcon from '@mui/icons-material/Description'; // File icon
import GradeIcon from '@mui/icons-material/Grade'; // Submit grade icon
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Mock Data (Replace with actual data fetching based on submission ID or assignment/user IDs)
const mockSubmissionData = {
    assignment: {
        id: 'a1',
        title: 'React Component Lifecycle Essay',
        course: 'Introduction to React',
        points: 100,
    },
    student: {
        id: 'u1',
        name: 'Alice Wonderland',
    },
    submission: {
        id: 's1',
        submittedAt: '2024-08-14T10:30:00Z',
        text: 'Here is my essay on the React component lifecycle, covering mounting, updating, and unmounting phases with examples...',
        files: [
            { name: 'React Lifecycle Essay.docx', url: '#' },
            { name: 'Lifecycle Examples.zip', url: '#' },
        ],
        grade: null, // Initially ungraded
        feedback: '',
        status: 'Submitted',
    }
};

export default function AssignmentGrading() {
    const { submissionId } = useParams(); // Or assignmentId/userId depending on routing
    const navigate = useNavigate();
    const [submissionData, setSubmissionData] = useState(mockSubmissionData); // Fetch based on ID
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');

    // TODO: Fetch submission details based on ID in a useEffect hook
    // useEffect(() => { ... fetch data ... setSubmissionData, setGrade(data.grade || ''), setFeedback(data.feedback || '') ... }, [submissionId]);

    const handleGradeChange = (event) => {
        // Allow only numbers, potentially restrict range
        const value = event.target.value.replace(/[^0-9]/g, '');
        // Optional: check if value > max points
        // if (parseInt(value, 10) > submissionData.assignment.points) { ... }
        setGrade(value);
    };

    const handleFeedbackChange = (event) => {
        setFeedback(event.target.value);
    };

    const handleSubmitGrade = () => {
        console.log("Submitting Grade for Submission:", submissionData.submission.id);
        console.log("Grade:", grade);
        console.log("Feedback:", feedback);
        // Add API call logic here to save grade and feedback
        alert('Grade Submitted (Mock)!');
        // Update local state to reflect grading
        setSubmissionData(prev => ({
             ...prev,
             submission: { ...prev.submission, grade: grade, feedback: feedback, status: 'Graded' }
        }));
        // Optionally navigate back or show success message
        navigate(-1); // Example: Go back to assignments list or grading queue
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
             <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                Back
            </Button>
            <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
                {/* Header */}
                <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
                    Grade Assignment
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={1} sx={{ mb: 2 }}>
                     <Box>
                         <Typography variant="h6">{submissionData.assignment.title}</Typography>
                         <Typography variant="subtitle1" color="text.secondary">{submissionData.assignment.course}</Typography>
                         <Typography variant="subtitle1" color="text.secondary">Student: {submissionData.student.name}</Typography>
                     </Box>
                     <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                         <Typography variant="body2" color="text.secondary">Max Points: {submissionData.assignment.points}</Typography>
                         <Typography variant="body2" color="text.secondary">Submitted: {new Date(submissionData.submission.submittedAt).toLocaleString()}</Typography>
                         <Chip label={submissionData.submission.status} color={submissionData.submission.status === 'Graded' ? 'success' : 'primary'} size="small" sx={{ mt: 1 }} />
                     </Box>
                 </Stack>
                <Divider sx={{ mb: 3 }} />

                {/* Student Submission */}
                 <Grid container spacing={3}>
                     {/* Submitted Text */}
                     {submissionData.submission.text && (
                         <Grid item xs={12} md={submissionData.submission.files.length > 0 ? 6 : 12}> {/* Adjust width based on files */} 
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>Submitted Text</Typography>
                            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {submissionData.submission.text}
                                </Typography>
                             </Paper>
                        </Grid>
                    )}
                    
                    {/* Submitted Files */}
                     {submissionData.submission.files.length > 0 && (
                        <Grid item xs={12} md={submissionData.submission.text ? 6 : 12}> {/* Adjust width */} 
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>Submitted Files</Typography>
                            <Paper variant="outlined" sx={{ p: 1, borderRadius: '8px' }}>
                                <List dense>
                                    {submissionData.submission.files.map((file, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon sx={{minWidth: 'auto', mr: 1.5}}>
                                                <DescriptionIcon />
                                            </ListItemIcon>
                                            {/* Make filename a link to download/view */}
                                            <Link href={file.url} target="_blank" rel="noopener noreferrer" underline="hover">
                                                <ListItemText primary={file.name} />
                                             </Link>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                    )}
                 </Grid>
                
                <Divider sx={{ my: 4 }} />

                {/* Grading Area */}
                <Box component="form" noValidate autoComplete="off">
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>Grade & Feedback</Typography>
                    <Grid container spacing={3} alignItems="flex-start">
                         <Grid item xs={12} sm={4} md={3}>
                            <TextField
                                label={`Grade (out of ${submissionData.assignment.points})`}
                                variant="outlined"
                                fullWidth
                                value={grade}
                                onChange={handleGradeChange}
                                type="number" // Use number type, but validation handles non-digits
                                inputProps={{
                                    max: submissionData.assignment.points, // Optional: Native max attribute
                                    min: 0,
                                }}
                                sx={{ mb: { xs: 2, sm: 0 } }}
                             />
                        </Grid>
                         <Grid item xs={12} sm={8} md={9}>
                             <TextField
                                label="Feedback / Comments"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                value={feedback}
                                onChange={handleFeedbackChange}
                             />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, textAlign: 'right' }}>
                         <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleSubmitGrade}
                            disabled={!grade} // Disable if grade is not entered
                            startIcon={<GradeIcon />} 
                        >
                            Submit Grade
                        </Button>
                     </Box>
                </Box>
            </Paper>
        </Container>
    );
} 