import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Import form step components (will be created next)
import BasicInfoForm from './BasicInfoForm';
import AdvanceInfoForm from './AdvanceInfoForm';
import ContentForm from './ContentForm';
import PublishForm from './PublishForm';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`course-tabpanel-${index}`}
      aria-labelledby={`course-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>{children}</Box>
      )}
    </div>
  );
}

// Mock data fetching function (replace with actual API call)
const fetchCourseData = async (courseId) => {
    console.log("Fetching course data for:", courseId);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return mock data - IN A REAL APP, FETCH FROM API!
    if (courseId === 'c1') { // Example ID
        return {
             title: 'Advanced React Masterclass', // Basic
             category: 'Programming',
             // ... other basic fields
             descriptions: ['Deep dive into hooks', 'State management patterns', 'Performance optimization', ''], // Advance
             // ... other advance fields
             sections: [ // Content
                 { id: 's1', title: 'Introduction', lectures: [{ id: 'l1', title: 'Welcome' }, { id: 'l2', title: 'Setup'}] },
                 { id: 's2', title: 'Advanced Hooks', lectures: [{ id: 'l3', title: 'useReducer Deep Dive' }] }
             ],
             // ... other fields populated from fetched data
         };
    } else {
        // Return null or throw error if course not found for edit
        return null; 
    }
};

const defaultCourseData = {
     // Basic Info
     title: '',
     subtitle: '',
     category: '',
     subCategory: '',
     topic: '',
     language: '',
     subtitleLanguage: '',
     level: '',
     durationValue: '',
     durationUnit: 'Day',
     // Advance Info
     thumbnail: null,
     trailer: null,
     descriptions: ['', '', '', ''], 
     targetAudience: ['', '', '', ''],
     requirements: ['', '', '', ''],
     // Content
     sections: [],
     // Publish
 };

export default function CourseEditor() {
  const { courseId } = useParams(); // Get courseId from URL
  const isEditMode = Boolean(courseId);

  const [activeStep, setActiveStep] = useState(0); // 0: Basic, 1: Advance, 2: Content, 3: Publish
  const [completedSteps, setCompletedSteps] = useState({}); // Track completed steps { 0: true, 1: false, ...}
  const [courseData, setCourseData] = useState(defaultCourseData);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  // Fetch data on component mount if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      fetchCourseData(courseId)
        .then(data => {
          if (data) {
            setCourseData(prev => ({ ...prev, ...data })); // Merge fetched data with defaults
            // Optionally mark steps as completed based on fetched data
            // setCompletedSteps({ 0: true, 1: true, ... });
          } else {
            console.error("Course not found for editing");
            // Handle error, maybe redirect
          }
        })
        .catch(error => {
          console.error("Error fetching course data:", error);
          // Handle error
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
        // Reset to default for create mode if navigating back/forth
         setCourseData(defaultCourseData);
         setActiveStep(0);
         setCompletedSteps({});
    }
  }, [courseId, isEditMode]); // Rerun if courseId changes

  const handleTabChange = (event, newValue) => {
      // Allow navigation only to completed steps or the next step
      // if (completedSteps[newValue - 1] || newValue < activeStep + 1) {
          setActiveStep(newValue);
      // }
  };

  const handleNext = (stepData) => {
      console.log(`Data from step ${activeStep}:`, stepData);
      setCourseData(prev => ({ ...prev, ...stepData }));
      setCompletedSteps(prev => ({ ...prev, [activeStep]: true }));
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

   const handleBack = () => {
     setActiveStep((prevActiveStep) => prevActiveStep - 1);
   };

   const handleSave = (stepData) => {
     const finalData = { ...courseData, ...stepData };
     console.log(`Saving ${isEditMode ? 'edited' : 'new'} course data:`, finalData);
     // API Call to save/update course (use courseId if isEditMode)
   }

  const steps = ['Basic Information', 'Advance Information', 'Content', 'Publish Course'];

  // Show loading indicator while fetching data in edit mode
   if (isLoading && isEditMode) {
     return <Typography>Loading course data...</Typography>; // Replace with a proper spinner/skeleton
   }

  const getStepContent = (step) => {
      switch (step) {
          case 0:
              return <BasicInfoForm initialData={courseData} onNext={handleNext} />;
          case 1:
              return <AdvanceInfoForm initialData={courseData} onNext={handleNext} onBack={handleBack} />;
          case 2:
              return <ContentForm initialData={courseData} onNext={handleNext} onBack={handleBack} />;
          case 3:
             return <PublishForm initialData={courseData} onSave={handleSave} onBack={handleBack} />;
          default:
              return 'Unknown step';
      }
  };

  return (
    <Box sx={{ width: '100%' }}>
       <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
           {isEditMode ? `Edit Course: ${courseData.title || courseId}` : 'Create New Course'}
       </Typography>
       <Paper sx={{ width: '100%', mb: 2, borderRadius: '12px', overflow: 'hidden' }}>
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
                             sx={{ textTransform: 'none', fontWeight: activeStep === index ? 'bold' : 'normal' }}
                             id={`course-tab-${index}`}
                             aria-controls={`course-tabpanel-${index}`}
                         />
                     ))}
                 </Tabs>
             </Box>

             {/* Render current step's content */}
             <Box sx={{ p: 3 }}>
                 {getStepContent(activeStep)}
             </Box>

            {/* TabPanel implementation - Can be used if we don't render directly */}
            {/* <TabPanel value={activeStep} index={0}>
                 <BasicInfoForm onNext={handleNext} />
             </TabPanel>
             <TabPanel value={activeStep} index={1}>
                 Advance Info Form Placeholder
             </TabPanel>
             <TabPanel value={activeStep} index={2}>
                 Content Form Placeholder
             </TabPanel>
             <TabPanel value={activeStep} index={3}>
                 Publish Form Placeholder
             </TabPanel> */}
       </Paper>
    </Box>
  );
} 