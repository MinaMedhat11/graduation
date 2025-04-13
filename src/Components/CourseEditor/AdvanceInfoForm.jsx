import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';

// Icons
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';

// Helper component for dynamic list inputs
const DynamicListInput = ({ label, placeholder, values, onChange, name }) => {

  const handleAddInput = () => {
    onChange(name, [...values, '']);
  };

  const handleRemoveInput = (index) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(name, newValues);
  };

  const handleInputChange = (index, event) => {
    const newValues = values.map((value, i) => (i === index ? event.target.value : value));
    onChange(name, newValues);
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>{label} ({values.length}/8)</Typography>
      {values.map((value, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleInputChange(index, e)}
            inputProps={{ maxLength: 120 }}
            helperText={value.length > 0 ? `${value.length}/120` : ' '} // Reserve space
            sx={{ mr: 1 }}
          />
          {values.length > 1 && (
            <IconButton onClick={() => handleRemoveInput(index)} size="small" color="error">
              <RemoveCircleOutlineIcon />
            </IconButton>
          )}
        </Box>
      ))}
       {values.length < 8 && (
            <Button size="small" startIcon={<AddCircleOutlineIcon />} onClick={handleAddInput} sx={{ textTransform: 'none' }}>
                Add new
            </Button>
        )}
    </Box>
  );
};

// Helper component for file uploads
const FileUploadPlaceholder = ({ title, description, icon, onFileUpload, uploadedFileName }) => (
    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderStyle: 'dashed' }}>
        {icon}
        <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>{title}</Typography>
        <Typography variant="caption" color="text.secondary" display="block">{description}</Typography>
        {uploadedFileName && <Typography variant="body2" sx={{ mt: 1, color: 'success.main' }}>{uploadedFileName}</Typography>}
        <Button
            variant="contained"
            component="label"
            size="small"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 1, backgroundColor: '#E8EAF6', color: '#3F51B5', '&:hover': { backgroundColor: '#D1D9FF' } }}
        >
            Upload {title.includes('Thumbnail') ? 'Image' : 'Video'}
            <input type="file" hidden onChange={onFileUpload} accept={title.includes('Thumbnail') ? "image/*" : "video/*"} />
        </Button>
    </Paper>
);


export default function AdvanceInfoForm({ initialData, onNext, onBack }) {
  const [formData, setFormData] = useState({
    thumbnail: initialData?.thumbnail || null,
    trailer: initialData?.trailer || null,
    descriptions: initialData?.descriptions?.length > 0 ? initialData.descriptions : [''],
    targetAudience: initialData?.targetAudience?.length > 0 ? initialData.targetAudience : [''],
    requirements: initialData?.requirements?.length > 0 ? initialData.requirements : [''],
  });

   const [thumbnailName, setThumbnailName] = useState(initialData?.thumbnail?.name || '');
   const [trailerName, setTrailerName] = useState(initialData?.trailer?.name || '');

  const handleListChange = (name, newValues) => {
    setFormData(prev => ({ ...prev, [name]: newValues }));
  };

   const handleFileChange = (event, fieldName, setName) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setFormData(prev => ({ ...prev, [fieldName]: file }));
            setName(file.name);
            console.log(`Uploaded ${fieldName}:`, file);
        }
    };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onNext(formData); // Pass data for this step to parent
  };

  return (
    <Box component="form" onSubmit={handleFormSubmit} sx={{ p: 3 }}>
      <Grid container spacing={3}>

         {/* Thumbnail & Trailer Upload */}
         <Grid item xs={12} md={6}>
             <FileUploadPlaceholder
                 title="Course Thumbnail"
                 description="Upload your course thumbnail here. Important guidelines: 1200x800 pixels or 16:9 ratio. Supported format: jpg, jpeg, or png"
                 icon={<PhotoCameraBackIcon sx={{ fontSize: 40, color: 'text.secondary' }} />}
                 onFileUpload={(e) => handleFileChange(e, 'thumbnail', setThumbnailName)}
                 uploadedFileName={thumbnailName}
            />
         </Grid>
         <Grid item xs={12} md={6}>
            <FileUploadPlaceholder
                 title="Course Trailer"
                 description="Students who watch a well-made promo video are 5X more likely to enroll in your course. Supported format: mp4, avi, or mov"
                 icon={<OndemandVideoIcon sx={{ fontSize: 40, color: 'text.secondary' }} />}
                 onFileUpload={(e) => handleFileChange(e, 'trailer', setTrailerName)}
                 uploadedFileName={trailerName}
            />
         </Grid>

        {/* What you will teach */}
        <Grid item xs={12}>
          <DynamicListInput
            label="What you will teach in this course..."
            placeholder="Enter a learning objective or outcome"
            values={formData.descriptions}
            onChange={handleListChange}
            name="descriptions"
          />
        </Grid>

        {/* Target Audience */}
        <Grid item xs={12}>
           <DynamicListInput
             label="Who this course is for..."
             placeholder="Enter a target audience"
             values={formData.targetAudience}
             onChange={handleListChange}
             name="targetAudience"
           />
        </Grid>

        {/* Requirements */}
         <Grid item xs={12}>
             <DynamicListInput
                 label="Course requirements..."
                 placeholder="Enter a requirement or prerequisite"
                 values={formData.requirements}
                 onChange={handleListChange}
                 name="requirements"
             />
          </Grid>

      </Grid>

       {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" onClick={onBack}>Previous</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#25cf9d', '&:hover': { backgroundColor: '#1da884' } }}>Save & Next</Button>
        </Box>
    </Box>
  );
} 