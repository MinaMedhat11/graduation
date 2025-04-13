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

// Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// Content Type Icons (Placeholders)
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionIcon from '@mui/icons-material/Description';
import NoteAltIcon from '@mui/icons-material/NoteAlt';

// --- Lecture Component ---
const LectureItem = ({ lecture, sectionIndex, lectureIndex, onUpdateLecture, onDeleteLecture }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAddContent = (contentType) => {
        console.log(`Add ${contentType} to lecture ${lectureIndex} in section ${sectionIndex}`);
        // Add logic here to update lecture state with content type
        // e.g., show relevant upload/input field
        handleMenuClose();
    };

    const handleTitleChange = (event) => {
        onUpdateLecture(sectionIndex, lectureIndex, { ...lecture, title: event.target.value });
    }

    return (
        <Paper variant="outlined" sx={{ p: 1.5, mb: 1, display: 'flex', alignItems: 'center' }}>
             <IconButton size="small" sx={{ cursor: 'grab', mr: 1 }}><DragIndicatorIcon fontSize="small" /></IconButton>
             <TextField
                variant="standard"
                size="small"
                fullWidth
                placeholder="Lecture name"
                value={lecture.title}
                onChange={handleTitleChange}
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
                Contents
            </Button>
            <Menu
                id={`content-menu-${sectionIndex}-${lectureIndex}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{ 'aria-labelledby': `content-button-${sectionIndex}-${lectureIndex}` }}
            >
                <MenuItem onClick={() => handleAddContent('Video')}><OndemandVideoIcon fontSize="small" sx={{ mr: 1 }}/>Video</MenuItem>
                <MenuItem onClick={() => handleAddContent('Attach File')}><AttachFileIcon fontSize="small" sx={{ mr: 1 }}/>Attach File</MenuItem>
                <MenuItem onClick={() => handleAddContent('Description')}><DescriptionIcon fontSize="small" sx={{ mr: 1 }}/>Description</MenuItem>
                <MenuItem onClick={() => handleAddContent('Lecture Notes')}><NoteAltIcon fontSize="small" sx={{ mr: 1 }}/>Lecture Notes</MenuItem>
            </Menu>
            <Tooltip title="Delete Lecture">
                 <IconButton size="small" color="error" sx={{ ml: 1 }} onClick={() => onDeleteLecture(sectionIndex, lectureIndex)}>
                     <DeleteOutlineIcon fontSize="small" />
                 </IconButton>
            </Tooltip>
             {/* Add placeholder/logic here to show added content type */}
        </Paper>
    );
}

// --- Section Component ---
const SectionItem = ({ section, index, onUpdateSection, onDeleteSection, onAddLecture, onUpdateLecture, onDeleteLecture }) => {

    const handleTitleChange = (event) => {
        onUpdateSection(index, { ...section, title: event.target.value });
    };

    return (
        <Accordion defaultExpanded sx={{ border: '1px solid #eee', mb: 2, '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`section-${index}-content`}
                id={`section-${index}-header`}
                sx={{ borderBottom: '1px solid #eee', bgcolor: '#fafafa' }}
            >
                <IconButton size="small" sx={{ cursor: 'grab', mr: 1 }}><DragIndicatorIcon fontSize="small" /></IconButton>
                <TextField
                    variant="standard"
                    size="small"
                    fullWidth
                    placeholder={`Section ${index + 1}: Section name`}
                    value={section.title}
                    onClick={(e) => e.stopPropagation()} // Prevent accordion toggle on textfield click
                    onChange={handleTitleChange}
                    InputProps={{ disableUnderline: true, style: { fontWeight: 500 } }}
                    sx={{ mr: 1 }}
                />
                 <Tooltip title="Delete Section">
                     <IconButton size="small" color="error" onClick={(e) => {e.stopPropagation(); onDeleteSection(index);}}>
                         <DeleteOutlineIcon fontSize="small" />
                     </IconButton>
                 </Tooltip>
                 {/* Add Edit icon if needed */}
                 {/* <IconButton size="small" sx={{ ml: 0.5 }}><EditIcon fontSize="small" /></IconButton> */}
            </AccordionSummary>
            <AccordionDetails sx={{ p: 2 }}>
                <Stack spacing={1}>
                   {section.lectures.map((lecture, lectureIndex) => (
                        <LectureItem
                            key={lectureIndex} // Consider using a unique ID if available
                            lecture={lecture}
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
}

// --- Main Content Form Component ---
export default function ContentForm({ initialData, onNext, onBack }) {
    // Initialize sections from initialData or start with one empty section
    const [sections, setSections] = useState(initialData?.sections?.length > 0 ? initialData.sections : [{ title: '', lectures: [{ title: '' }] }]);

    const handleAddSection = () => {
        setSections(prev => [...prev, { title: '', lectures: [{ title: '' }] }]);
    };

    const handleUpdateSection = (index, updatedSection) => {
        setSections(prev => prev.map((section, i) => i === index ? updatedSection : section));
    };

    const handleDeleteSection = (index) => {
        setSections(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddLecture = (sectionIndex) => {
        setSections(prev => prev.map((section, i) => {
            if (i === sectionIndex) {
                return { ...section, lectures: [...section.lectures, { title: '' }] };
            }
            return section;
        }));
    };

    const handleUpdateLecture = (sectionIndex, lectureIndex, updatedLecture) => {
        setSections(prev => prev.map((section, i) => {
            if (i === sectionIndex) {
                const newLectures = section.lectures.map((lecture, li) => li === lectureIndex ? updatedLecture : lecture);
                return { ...section, lectures: newLectures };
            }
            return section;
        }));
    };

    const handleDeleteLecture = (sectionIndex, lectureIndex) => {
         setSections(prev => prev.map((section, i) => {
             if (i === sectionIndex) {
                 // Prevent deleting the last lecture in a section
                 if (section.lectures.length <= 1) return section;
                 const newLectures = section.lectures.filter((_, li) => li !== lectureIndex);
                 return { ...section, lectures: newLectures };
             }
             return section;
         }));
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        // Validate data if needed
        onNext({ sections }); // Pass updated sections data to parent
    };

    return (
        <Box component="form" onSubmit={handleFormSubmit} sx={{ p: 3 }}>
            {sections.map((section, index) => (
                <SectionItem
                    key={index} // Consider using a unique ID if sections have one
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
                 sx={{ mt: 2, mb: 3, backgroundColor: '#25cf9d', '&:hover': { backgroundColor: '#1da884' } }}
             >
                 Add Sections
             </Button>

             {/* Action Buttons */}
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                 <Button variant="outlined" onClick={onBack}>Previous</Button>
                 <Button type="submit" variant="contained" sx={{ backgroundColor: '#25cf9d', '&:hover': { backgroundColor: '#1da884' } }}>Save & Next</Button>
             </Box>
        </Box>
    );
} 