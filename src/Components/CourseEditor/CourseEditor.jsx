import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BasicInfoForm from './BasicInfoForm';
import AdvancedInfoForm from './AdvanceInfoForm';
import ContentForm from './ContentForm';
import PublishForm from './PublishForm';
// API Service Functions
const apiService = {
  createCourse: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://127.0.0.1:8000/api/courses/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) throw new Error('Failed to create course');
    return await response.json();
  },
  fetchCourse: async (courseId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://127.0.0.1:8000/api/courses/show/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch course data');
    return await response.json();
  },
  updateCourse: async (courseId, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://127.0.0.1:8000/api/courses/update/${courseId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update course');
    return await response.json();
  }
};
const defaultCourseData = {
  courseId: null,
  name: '',
  major_id: '',
  price: '',
  discount: '',
  description: '',
  bio: '',
  course_image: '',
  requirements: [],
  descriptions: [],
};
export default function CourseEditor() {
  const { courseId } = useParams();
  const isEditMode = Boolean(courseId);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});
  const [courseData, setCourseData] = useState(defaultCourseData);
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);
  // Fetch data on component mount if in edit mode
  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseId) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiService.fetchCourse(courseId);
        setApiData(data);
        setCourseData(prev => ({
          ...prev,
          courseId: data.id,
          name: data.name,
          major_id: data.major_id,
          price: data.price,
          discount: data.discount,
          description: data.description,
          bio: data.bio,
          course_image: data.course_image,
          requirements: data.requirements || [],
          descriptions: data.outcomes || []
        }));
        // Steps completed
        const completed = {};
        if (data.name) completed[0] = true;
        if (data.outcomes?.length > 0 || data.requirements?.length > 0) completed[1] = true;
        if (data.sections?.length > 0) completed[2] = true;
        setCompletedSteps(completed);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadCourseData();
  }, [courseId]);
  // To reload after create
  useEffect(() => {
    if (!isEditMode && activeStep === 1 && courseData.courseId) {
      const loadApiData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await apiService.fetchCourse(courseData.courseId);
          setApiData(data);
          setCourseData(prev => ({
            ...prev,
            name: data.name,
            major_id: data.major_id,
            price: data.price,
            discount: data.discount,
            description: data.description,
            requirements: data.requirements || [],
            descriptions: data.outcomes || [],
          }));
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      loadApiData();
    }
  }, [activeStep, isEditMode, courseData.courseId]);
  // steps click
  const handleTabChange = (event, newValue) => {
    if (completedSteps[newValue - 1] || newValue < activeStep + 1) {
      setActiveStep(newValue);
    }
  };
  // Main next handler for all forms
  const handleNext = async (stepData) => {
    // stepData ممكن يكون رقم الكورس في BasicInfoForm، أو بيانات عادية في الباقي
    // في أول خطوة وإنشاء جديد أستقبل فقط الكورس id مباشرة (من BasicInfoForm)
    if (activeStep === 0 && !courseId && typeof stepData === 'number') {
      setCourseData(prev => ({ ...prev, courseId: stepData }));
      setCompletedSteps(prev => ({ ...prev, [activeStep]: true }));
      setActiveStep(1);
    } else {
      setCourseData(prev => ({ ...prev, ...stepData }));
      setCompletedSteps(prev => ({ ...prev, [activeStep]: true }));
      setActiveStep(prev => prev + 1);
    }
  };
  const handleBack = () => setActiveStep(prev => prev - 1);
  const handleSave = async (stepData) => {
    try {
      setIsLoading(true);
      setError(null);
      const updateData = {
        name: courseData.name || apiData?.name,
        description: courseData.description || apiData?.description,
        price: courseData.price || apiData?.price,
        discount: courseData.discount || apiData?.discount,
        major_id: courseData.major_id || apiData?.major_id,
        requirements: courseData.requirements || [],
        outcomes: courseData.descriptions || []
      };
      if (stepData) Object.assign(updateData, stepData);
      await apiService.updateCourse(courseData.courseId, updateData);
      console.log('Course updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const steps = ['Basic Information', 'Advance Information', 'Content', 'Publish Course'];
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <BasicInfoForm
          initialData={courseData}
          onNext={handleNext}
          isEditMode={isEditMode}
          isLoading={isLoading}
        />;
      case 1:
        return <AdvancedInfoForm
          onNext={handleNext}
          onBack={handleBack}
          courseId={courseData.courseId}
        />;
      case 2:
        return <ContentForm
          initialData={courseData}
          onNext={handleNext}
          onBack={handleBack}
          isLoading={isLoading}
          courseId={courseData.courseId}
        />;
      case 3:
        return <PublishForm
          initialData={courseData}
          onSave={handleSave}
          onBack={handleBack}
          isLoading={isLoading}
        />;
      default:
        return 'Unknown step';
    }
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        {isEditMode ? `Edit Course: ${courseData.name || courseId}` : 'Create New Course'}
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Paper sx={{
        width: '100%',
        mb: 2,
        borderRadius: '12px',
        overflow: 'hidden',
        opacity: isLoading ? 0.6 : 1
      }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#F9FAFB' }}>
          <Tabs
            value={activeStep}
            onChange={handleTabChange}
            aria-label="Course creation steps"
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            {steps.map((label, index) => (
              <Tab
                key={label}
                label={label}
                icon={completedSteps[index] ? <CheckCircleIcon fontSize="small" color="success" /> : undefined}
                iconPosition="end"
                disabled={!(completedSteps[index - 1] || index === activeStep || index === 0)}
                sx={{
                  textTransform: 'none',
                  fontWeight: activeStep === index ? 'bold' : 'normal'
                }}
                id={`course-tab-${index}`}
                aria-controls={`course-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>
          {getStepContent(activeStep)}
        </Box>
      </Paper>
    </Box>
  );
}