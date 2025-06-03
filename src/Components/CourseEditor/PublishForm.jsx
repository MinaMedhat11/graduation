import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';

// Icons
import PublishIcon from '@mui/icons-material/Publish';

export default function PublishForm({ initialData, onSave, onBack }) {

    // You could display a summary of 'initialData' here for review

    const handlePublish = () => {
        // Pass the final data up (although CourseEditor already has it)
        onSave(initialData); 
    };

    return (
        <Box sx={{ p: 3 }}>
             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Publish Course</Typography>
             <Alert severity="info" sx={{ mb: 3 }}>
                 Review your course details in the previous steps. Once you publish, the course will be live (or submitted for review, depending on your workflow).
             </Alert>

             {/* Placeholder for potential final settings or summary */}
             {/* Example Summary: */}
             {/* <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                 <Typography variant="subtitle1">Summary:</Typography>
                 <Typography variant="body2">Title: {initialData.title || 'Not Set'}</Typography>
                 <Typography variant="body2">Sections: {initialData.sections?.length || 0}</Typography>
                 {/* ... more summary details ... */}
             {/* </Paper> */}

           <Typography sx={{ mb: 3 }}>
    Clicking &apos;Publish Course&apos; will make your course available according to the platform settings.
</Typography>

             {/* Action Buttons */}
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                 <Button variant="outlined" onClick={onBack}>Previous</Button>
                 <Button
                     variant="contained"
                     onClick={handlePublish}
                     startIcon={<PublishIcon />}
                     sx={{ backgroundColor: '#25cf9d', '&:hover': { backgroundColor: '#1da884' } }}
                >
                    Publish Course
                </Button>
             </Box>
        </Box>
    );
} 