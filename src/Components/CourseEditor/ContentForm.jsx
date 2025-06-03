import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionIcon from '@mui/icons-material/Description';
import NoteAltIcon from '@mui/icons-material/NoteAlt';

const LectureItem = ({ lecture, sectionIndex, lectureIndex, onUpdateLecture, onDeleteLecture }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [showVideoUrl, setShowVideoUrl] = useState(lecture.type === 'video');
    const [showDescription, setShowDescription] = useState(false);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAddContent = (contentType) => {
        const updatedLecture = {
            ...lecture,
            type: contentType === 'Video' ? 'video' : contentType.toLowerCase(),
            quiz_data: null,
            is_free: 0
        };
        
        onUpdateLecture(sectionIndex, lectureIndex, updatedLecture);
        setShowVideoUrl(contentType === 'Video');
        setShowDescription(true);
        handleMenuClose();
    };

    const handleFieldChange = (field, value) => {
        onUpdateLecture(sectionIndex, lectureIndex, { ...lecture, [field]: value });
    };

    return (
        <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton size="small" sx={{ cursor: 'grab', mr: 1 }}>
                    <DragIndicatorIcon fontSize="small" />
                </IconButton>
                
                <TextField
                    variant="standard"
                    size="small"
                    fullWidth
                    placeholder="Lecture name"
                    value={lecture.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    InputProps={{ disableUnderline: true }}
                    sx={{ mr: 1 }}
                />
                
                <Button
                    id={`content-button-${sectionIndex}-${lectureIndex}`}
                    aria-controls={open ? `content-menu-${sectionIndex}-${lectureIndex}` : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    variant="outlined"
                    size="small"
                    onClick={handleMenuClick}
                    endIcon={<ArrowDropDownIcon />}
                    sx={{ textTransform: 'none', minWidth: 120 }}
                >
                    {lecture.type || 'Content Type'}
                </Button>
                
                <Menu
                    id={`content-menu-${sectionIndex}-${lectureIndex}`}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    MenuListProps={{ 'aria-labelledby': `content-button-${sectionIndex}-${lectureIndex}` }}
                >
                    <MenuItem onClick={() => handleAddContent('Video')}>
                        <OndemandVideoIcon fontSize="small" sx={{ mr: 1 }} />
                        Video
                    </MenuItem>
                    <MenuItem onClick={() => handleAddContent('Attach File')}>
                        <AttachFileIcon fontSize="small" sx={{ mr: 1 }} />
                        Attach File
                    </MenuItem>
                    <MenuItem onClick={() => handleAddContent('Description')}>
                        <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                        Description
                    </MenuItem>
                    <MenuItem onClick={() => handleAddContent('Lecture Notes')}>
                        <NoteAltIcon fontSize="small" sx={{ mr: 1 }} />
                        Lecture Notes
                    </MenuItem>
                </Menu>
                
                <Tooltip title="Delete Lecture">
                    <IconButton 
                        size="small" 
                        color="error" 
                        sx={{ ml: 1 }} 
                        onClick={() => onDeleteLecture(sectionIndex, lectureIndex)}
                    >
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            {showVideoUrl && (
                <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    label="Video URL"
                    value={lecture.video_url || ''}
                    onChange={(e) => handleFieldChange('video_url', e.target.value)}
                    sx={{ mb: 2 }}
                />
            )}
            
            <TextField
                variant="outlined"
                size="small"
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={lecture.duration || ''}
                onChange={(e) => handleFieldChange('duration', e.target.value)}
                sx={{ mb: 2 }}
            />
            
            {showDescription && (
                <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={lecture.description || ''}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    sx={{ mb: 2 }}
                />
            )}
        </Paper>
    );
};

const SectionItem = ({ section, index, onUpdateSection, onDeleteSection, onAddLecture, onUpdateLecture, onDeleteLecture }) => {
    const handleTitleChange = (event) => {
        onUpdateSection(index, { ...section, title: event.target.value });
    };

    return (
        <Accordion defaultExpanded sx={{ 
            border: '1px solid #eee', 
            mb: 2, 
            '&:before': { display: 'none' }, 
            boxShadow: 'none' 
        }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`section-${index}-content`}
                id={`section-${index}-header`}
                sx={{ borderBottom: '1px solid #eee', bgcolor: '#fafafa' }}
            >
                <IconButton size="small" sx={{ cursor: 'grab', mr: 1 }}>
                    <DragIndicatorIcon fontSize="small" />
                </IconButton>
                
                <TextField
                    variant="standard"
                    size="small"
                    fullWidth
                    placeholder={`Section ${index + 1}: Section name`}
                    value={section.title}
                    onClick={(e) => e.stopPropagation()}
                    onChange={handleTitleChange}
                    InputProps={{ 
                        disableUnderline: true, 
                        style: { fontWeight: 500 } 
                    }}
                    sx={{ mr: 1 }}
                />
                
                <Tooltip title="Delete Section">
                    <IconButton 
                        size="small" 
                        color="error" 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            onDeleteSection(index);
                        }}
                    >
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </AccordionSummary>
            
            <AccordionDetails sx={{ p: 2 }}>
                <Stack spacing={2}>
                    {section.lectures.map((lecture, lectureIndex) => (
                        <LectureItem
                            key={lectureIndex}
                            lecture={{ ...lecture, order: lectureIndex + 1 }}
                            sectionIndex={index}
                            lectureIndex={lectureIndex}
                            onUpdateLecture={onUpdateLecture}
                            onDeleteLecture={onDeleteLecture}
                        />
                    ))}
                </Stack>
                
                <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => onAddLecture(index)}
                    sx={{ mt: 1, textTransform: 'none' }}
                >
                    Add Lecture
                </Button>
            </AccordionDetails>
        </Accordion>
    );
};

export default function ContentForm({ courseId, initialData, onNext, onBack }) {
    const [sections, setSections] = useState(
        initialData?.sections?.length > 0 
            ? initialData.sections 
            : [{ 
                title: '', 
                lectures: [{ 
                    title: '', 
                    type: '', 
                    description: '', 
                    video_url: '', 
                    duration: 0, 
                    order: 1, 
                    is_free: 0, 
                    quiz_data: null 
                }] 
            }]
    );
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleAddSection = () => {
        setSections(prev => [...prev, { 
            title: '', 
            lectures: [{ 
                title: '', 
                type: '', 
                description: '', 
                video_url: '', 
                duration: 0, 
                order: 1, 
                is_free: 0, 
                quiz_data: null 
            }] 
        }]);
    };

    const handleUpdateSection = (index, updatedSection) => {
        setSections(prev => prev.map((section, i) => 
            i === index ? updatedSection : section
        ));
    };

    const handleDeleteSection = (index) => {
        setSections(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddLecture = (sectionIndex) => {
        setSections(prev => prev.map((section, i) => {
            if (i === sectionIndex) {
                return { 
                    ...section, 
                    lectures: [...section.lectures, { 
                        title: '', 
                        type: '', 
                        description: '', 
                        video_url: '', 
                        duration: 0, 
                        order: section.lectures.length + 1, 
                        is_free: 0, 
                        quiz_data: null 
                    }] 
                };
            }
            return section;
        }));
    };

    const handleUpdateLecture = (sectionIndex, lectureIndex, updatedLecture) => {
        setSections(prev => prev.map((section, i) => {
            if (i === sectionIndex) {
                const newLectures = section.lectures.map((lecture, li) => 
                    li === lectureIndex ? updatedLecture : lecture
                );
                return { ...section, lectures: newLectures };
            }
            return section;
        }));
    };

    const handleDeleteLecture = (sectionIndex, lectureIndex) => {
        setSections(prev => prev.map((section, i) => {
            if (i === sectionIndex) {
                if (section.lectures.length <= 1) return section;
                
                const newLectures = section.lectures
                    .filter((_, li) => li !== lectureIndex)
                    .map((lecture, index) => ({ 
                        ...lecture, 
                        order: index + 1 
                    }));
                
                return { ...section, lectures: newLectures };
            }
            return section;
        }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            // Prepare all requests
            const requests = sections.flatMap(section => {
                return section.lectures.map(lecture => {
                    const lectureData = {
                        course_id: courseId,
                        section_name: section.title,
                        title: lecture.title,
                        type: lecture.type || 'video',
                        description: lecture.description || '',
                        order: lecture.order,
                        duration: lecture.duration || 0,
                        is_free: 0,
                        video_url: lecture.video_url || '',
                        quiz_data: null
                    };

                    return fetch('http://127.0.0.1:8000/api/course-content/', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(lectureData)
                    });
                });
            });

            // Execute all requests
            const responses = await Promise.all(requests);
            
            // Check for any failed requests
            const hasErrors = responses.some(response => !response.ok);
            if (hasErrors) {
                const errorResults = await Promise.all(
                    responses.map(res => res.ok ? null : res.json().catch(() => null))
                );
                const errorMessages = errorResults.filter(Boolean).map(err => err.message);
                throw new Error(
                    `Some lectures failed to save: ${errorMessages.join(', ')}`
                );
            }

            onNext({ sections });
        } catch (error) {
            console.error('Error saving content:', error);
            setError(error.message || 'An error occurred while saving');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleFormSubmit} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Course Content
            </Typography>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            {sections.map((section, index) => (
                <SectionItem
                    key={index}
                    section={section}
                    index={index}
                    onUpdateSection={handleUpdateSection}
                    onDeleteSection={handleDeleteSection}
                    onAddLecture={handleAddLecture}
                    onUpdateLecture={handleUpdateLecture}
                    onDeleteLecture={handleDeleteLecture}
                />
            ))}
            
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddSection}
                sx={{ 
                    mt: 2, 
                    mb: 3, 
                    backgroundColor: '#25cf9d', 
                    '&:hover': { backgroundColor: '#1da884' } 
                }}
            >
                Add Section
            </Button>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="outlined" onClick={onBack}>
                    Previous
                </Button>
                
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ 
                        backgroundColor: '#25cf9d', 
                        '&:hover': { backgroundColor: '#1da884' } 
                    }}
                >
                    {isSubmitting ? 'Saving...' : 'Save & Next'}
                </Button>
            </Box>
        </Box>
    );
}