import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton'; // مش مستخدم فوق

import DynamicListInput from './DynamicListInput';

export default function AdvancedInfoForm({ onNext, onBack, courseId }) {
  const [formData, setFormData] = useState({
    descriptions: [''],
    requirements: [''],
  });
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Received courseId in AdvancedInfoForm:", courseId);
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/api/courses/show/${courseId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch course data');
        }
        const data = await response.json();
        setCourseData(data);
        setFormData({
          descriptions: data.outcomes && data.outcomes.length > 0 ? data.outcomes : [''],
          requirements: data.requirements && data.requirements.length > 0 ? data.requirements : [''],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const handleListChange = (name, newValues) => {
    setFormData(prev => ({ ...prev, [name]: newValues }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!courseData) {
      setError('Course data not loaded');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        name: courseData.name,
        description: courseData.description,
        price: courseData.price,
        discount: courseData.discount,
        major_id: courseData.major_id,
        requirements: formData.requirements,
        outcomes: formData.descriptions
      };
      console.log("Data to be sent to API:", updateData);
      const response = await fetch(`http://127.0.0.1:8000/api/courses/update/${courseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      if (!response.ok) {
        throw new Error('Failed to update course');
      }
      onNext(formData);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading course data...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <Box component="form" onSubmit={handleFormSubmit} sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Course Details
          </Typography>
          <DynamicListInput
            label="What you will teach in this course..."
            placeholder="Enter a learning objective or outcome"
            values={formData.descriptions}
            onChange={handleListChange}
            name="descriptions"
          />
        </Grid>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant="outlined" onClick={onBack}>Previous</Button>
        <Button type="submit" variant="contained" sx={{ backgroundColor: '#25cf9d', '&:hover': { backgroundColor: '#1da884' } }}>Save & Next</Button>
      </Box>
    </Box>
  );
}