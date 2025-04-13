import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // To get assignmentId and navigate
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';

// Icons
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description'; // File icon
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send'; // Submit icon
import CancelIcon from '@mui/icons-material/Cancel';

// Mock Assignment Data (replace with actual data fetching)
const mockAssignmentDetails = {
    id: 'a1',
    title: 'React Component Lifecycle Essay',
    course: 'Introduction to React',
    dueDate: '2024-08-15',
    points: 100,
    status: 'Not Submitted', // Could be 'Submitted', 'Graded', 'Late'
    instructions: 'Write a 500-word essay explaining the different phases of the React component lifecycle (Mounting, Updating, Unmounting). Discuss the key methods involved in each phase and their common use cases. Provide code examples where appropriate.',
};

export default function AssignmentSubmission() {
    const { assignmentId } = useParams(); // Get assignmentId from URL if needed
    const navigate = useNavigate();
    const [submissionText, setSubmissionText] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]); // Array of file objects { name: string, size: number }
    const [assignmentData, setAssignmentData] = useState(mockAssignmentDetails); // Fetch based on assignmentId

    // TODO: Fetch assignment details based on assignmentId in a useEffect hook

    const handleTextChange = (event) => {
        setSubmissionText(event.target.value);
    };

    // Mock file upload handler
    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const newFiles = files.map(file => ({
            name: file.name,
            // In a real scenario, you might want to include size, type, etc.
            // size: file.size 
        }));
        setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
        // Reset file input to allow uploading the same file again if needed
        event.target.value = null; 
    };

    const handleDeleteFile = (fileName) => {
        setUploadedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    };

    const handleSubmit = () => {
        console.log("Submitting Assignment:", assignmentId);
        console.log("Text:", submissionText);
        console.log("Files:", uploadedFiles);
        // Add API call logic here
        alert('Assignment Submitted (Mock)!');
        setAssignmentData(prev => ({ ...prev, status: 'Submitted' })); // Update status locally (mock)
        // Optionally navigate away or disable submission fields
         navigate(-1); // Navigate back
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

                     {/* File Upload */}
                     <Box sx={{ border: '2px dashed #e0e0e0', borderRadius: '8px', p: 3, textAlign: 'center', bgcolor: '#fafafa' }}>
                         <UploadFileIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                         <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            Drag & drop files here or click to browse
                        </Typography>
                         <Button
                            variant="outlined"
                            component="label" // Makes the button act as a label for the hidden input
                        >
                            Browse Files
                            <input 
                                type="file" 
                                hidden 
                                multiple 
                                onChange={handleFileUpload} 
                            />
                        </Button>

                         {/* Display Uploaded Files */}
                         {uploadedFiles.length > 0 && (
                             <List dense sx={{ mt: 2, bgcolor: '#fff', borderRadius: '4px' }}>
                                 {uploadedFiles.map((file) => (
                                     <ListItem key={file.name}>
                                         <DescriptionIcon sx={{ mr: 1, color: 'action.active' }} />
                                         <ListItemText primary={file.name} />
                                         <ListItemSecondaryAction>
                                             <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteFile(file.name)}>
                                                 <DeleteIcon />
                                             </IconButton>
                                         </ListItemSecondaryAction>
                                     </ListItem>
                                 ))}
                             </List>
                         )}
                     </Box>
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
                        disabled={assignmentData.status !== 'Not Submitted'} // Disable if already submitted
                        startIcon={<SendIcon />} 
                    >
                        {assignmentData.status === 'Not Submitted' ? 'Submit Assignment' : 'Resubmit Assignment'} 
                    </Button>
                </Stack>

            </Paper>
        </Container>
    );
} 