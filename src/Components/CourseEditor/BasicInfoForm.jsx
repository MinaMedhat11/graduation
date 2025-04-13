import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

// Mock Data for dropdowns
const categories = ['Web Development', 'Mobile Development', 'Data Science', 'Design'];
const subCategories = {
    'Web Development': ['Front-End', 'Back-End', 'Full-Stack'],
    'Mobile Development': ['iOS', 'Android', 'Cross-Platform'],
    'Data Science': ['Machine Learning', 'Analytics', 'Big Data'],
    'Design': ['UI/UX', 'Graphic Design', 'Illustration'],
};
const languages = ['English', 'Spanish', 'French', 'Arabic'];
const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const durationUnits = ['Day', 'Week', 'Month'];


export default function BasicInfoForm({ initialData, onNext }) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        subtitle: initialData?.subtitle || '',
        category: initialData?.category || '',
        subCategory: initialData?.subCategory || '',
        topic: initialData?.topic || '',
        language: initialData?.language || '',
        subtitleLanguage: initialData?.subtitleLanguage || '',
        level: initialData?.level || '',
        durationValue: initialData?.durationValue || '',
        durationUnit: initialData?.durationUnit || 'Day',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            // Reset subcategory if category changes
            if (name === 'category') {
                newState.subCategory = '';
            }
            return newState;
        });
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        onNext(formData); // Pass data to parent
    };

    // Dynamically get subcategories based on selected category
    const currentSubCategories = formData.category ? subCategories[formData.category] || [] : [];

    return (
        <Box component="form" onSubmit={handleFormSubmit} sx={{ p: 3 }}> {/* Added padding */}
             <Grid container spacing={3}>
                {/* Title */}
                <Grid item xs={12}>
                     <TextField
                         required
                         fullWidth
                         label="Title"
                         name="title"
                         value={formData.title}
                         onChange={handleChange}
                         size="small"
                         inputProps={{ maxLength: 80 }}
                         helperText={`${formData.title.length}/80`}
                     />
                 </Grid>

                 {/* Subtitle */}
                  <Grid item xs={12}>
                     <TextField
                         required
                         fullWidth
                         label="Subtitle"
                         name="subtitle"
                         value={formData.subtitle}
                         onChange={handleChange}
                         size="small"
                         inputProps={{ maxLength: 120 }}
                         helperText={`${formData.subtitle.length}/120`}
                     />
                 </Grid>

                 {/* Category & Sub-Category */}
                 <Grid item xs={12} sm={6}>
                     <FormControl fullWidth required size="small">
                         <InputLabel id="category-select-label">Course Category</InputLabel>
                         <Select
                             labelId="category-select-label"
                             label="Course Category"
                             name="category"
                             value={formData.category}
                             onChange={handleChange}
                         >
                             {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                         </Select>
                     </FormControl>
                 </Grid>
                 <Grid item xs={12} sm={6}>
                     <FormControl fullWidth required size="small" disabled={!formData.category}>
                         <InputLabel id="subCategory-select-label">Course Sub-category</InputLabel>
                         <Select
                             labelId="subCategory-select-label"
                             label="Course Sub-category"
                             name="subCategory"
                             value={formData.subCategory}
                             onChange={handleChange}
                         >
                             {currentSubCategories.map(subCat => <MenuItem key={subCat} value={subCat}>{subCat}</MenuItem>)}
                         </Select>
                     </FormControl>
                 </Grid>

                  {/* Topic */}
                  <Grid item xs={12}>
                     <TextField
                         required
                         fullWidth
                         label="Course Topic"
                         name="topic"
                         value={formData.topic}
                         onChange={handleChange}
                         size="small"
                         placeholder="What is primarily taught in your course?"
                     />
                 </Grid>

                {/* Language, Subtitle Language, Level */}
                 <Grid item xs={12} sm={6} md={4}>
                     <FormControl fullWidth required size="small">
                         <InputLabel id="language-select-label">Course Language</InputLabel>
                         <Select labelId="language-select-label" label="Course Language" name="language" value={formData.language} onChange={handleChange}>
                             {languages.map(lang => <MenuItem key={lang} value={lang}>{lang}</MenuItem>)}
                         </Select>
                     </FormControl>
                 </Grid>
                 <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth size="small">
                         <InputLabel id="subtitleLanguage-select-label">Subtitle Language (Optional)</InputLabel>
                         <Select labelId="subtitleLanguage-select-label" label="Subtitle Language (Optional)" name="subtitleLanguage" value={formData.subtitleLanguage} onChange={handleChange}>
                              <MenuItem value=""><em>None</em></MenuItem>
                             {languages.map(lang => <MenuItem key={lang} value={lang}>{lang}</MenuItem>)}
                         </Select>
                     </FormControl>
                 </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                     <FormControl fullWidth required size="small">
                         <InputLabel id="level-select-label">Course Level</InputLabel>
                         <Select labelId="level-select-label" label="Course Level" name="level" value={formData.level} onChange={handleChange}>
                             {levels.map(lvl => <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>)}
                         </Select>
                     </FormControl>
                 </Grid>

                {/* Duration */}
                 <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required size="small">
                         <InputLabel id="durationUnit-select-label">Course durations</InputLabel>
                         <Select labelId="durationUnit-select-label" label="Course durations" name="durationUnit" value={formData.durationUnit} onChange={handleChange}>
                             {durationUnits.map(unit => <MenuItem key={unit} value={unit}>{unit}</MenuItem>)}
                         </Select>
                     </FormControl>
                     {/* This input needs better integration with the dropdown, perhaps combined component */}
                     {/* <TextField
                         required
                         fullWidth
                         label="Course Duration Value"
                         name="durationValue"
                         type="number"
                         value={formData.durationValue}
                         onChange={handleChange}
                         size="small"
                         InputProps={{ endAdornment: <InputAdornment position="end">{formData.durationUnit}</InputAdornment> }}
                     /> */}
                 </Grid>

             </Grid>

             {/* Action Buttons */}
             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                 <Button variant="outlined" sx={{ mr: 1 }}>Cancel</Button>
                 <Button type="submit" variant="contained" sx={{ backgroundColor: '#25cf9d', '&:hover': { backgroundColor: '#1da884' } }}>Save & Next</Button>
             </Box>
        </Box>
    );
} 