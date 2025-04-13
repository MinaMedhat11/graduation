import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid'; // For Dialog layout
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

// Icons
import GroupIcon from '@mui/icons-material/Group'; // Title Icon
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'; // Add student icon
import CloseIcon from '@mui/icons-material/Close';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Mock Data
const studentsData = [
  { id: 1, name: 'Kristin Watson', email: 'ahmedfgdt132155156@yahoo.com', course: 'Figma UI', status: 'Active', avatar: '/static/images/avatar/1.jpg' },
  { id: 2, name: 'Marvin McKinney', email: 'ahmedfgdt132155156@yahoo.com', course: 'Figma UI', status: 'Completed', avatar: '/static/images/avatar/2.jpg' },
  { id: 3, name: 'Jane Cooper', email: 'ahmedfgdt132155156@yahoo.com', course: 'Figma UI', status: 'Active', avatar: '/static/images/avatar/3.jpg' },
  { id: 4, name: 'Cody Fisher', email: 'ahmedfgdt132155156@yahoo.com', course: 'Figma UI', status: 'Withdrawn', avatar: '/static/images/avatar/4.jpg' },
  { id: 5, name: 'Bessie Cooper', email: 'ahmed@ya.com', course: 'Figma UI', status: 'Active', avatar: '/static/images/avatar/5.jpg' },
  { id: 6, name: 'Leslie Alexander', email: 'ahmed@ya.com', course: 'Figma UI', status: 'Completed', avatar: '/static/images/avatar/6.jpg' },
  { id: 7, name: 'Guy Hawkins', email: 'ahmed@ya.com', course: 'Figma UI', status: 'Completed', avatar: '/static/images/avatar/7.jpg' },
  { id: 8, name: 'Theresa Webb', email: 'ahmed@ya.com', course: 'Figma UI', status: 'Completed', avatar: '/static/images/avatar/1.jpg' }, // Reusing avatars
  { id: 9, name: 'Jerome Bell', email: 'ahmed@ya.com', course: 'Figma UI', status: 'Active', avatar: '/static/images/avatar/2.jpg' },
  { id: 10, name: 'Savannah Nguyen', email: 'ahmed@ya.com', course: 'Figma UI', status: 'Active', avatar: '/static/images/avatar/3.jpg' },
  { id: 11, name: 'Kristin Watson', email: 'ahmed@ya.com', course: 'Figma UI', status: 'Completed', avatar: '/static/images/avatar/4.jpg' },
  { id: 12, name: 'Wade Warren', email: 'ahmed@ya.com', course: 'Figma UI', status: 'Completed', avatar: '/static/images/avatar/5.jpg' },
  { id: 13, name: 'Annette Black', email: 'ahmed@ya.com', course: 'Figma UI', status: 'Withdrawn', avatar: '/static/images/avatar/6.jpg' },
];

// Helper to get status chip props
const getStatusChipProps = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return { color: 'success', label: 'Active' };
    case 'completed':
      return { color: 'primary', label: 'Completed' };
    case 'withdrawn':
      return { color: 'error', label: 'Withdrawn' };
    default:
      return { color: 'default', label: status };
  }
};

// --- Add Student Dialog Component ---
const AddStudentDialog = ({ open, handleClose, handleAddStudent }) => {
    const [studentData, setStudentData] = useState({
        name: '',
        class: '',
        course: '',
        email: '',
        phone: '',
        password: '',
        // image: null
    });
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setStudentData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            // setStudentData(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleAddStudent(studentData); // Pass data to parent handler
        handleClose(); // Close dialog after submission
        // Reset form potentially?
    };

    // Mock data for dropdowns
    const classes = ['Class A', 'Class B', 'Class C'];
    const courses = ['Figma UI', 'Flutter Basics', 'Advanced Networks'];

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Add Students
                <IconButton aria-label="close" onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                 <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Image Upload Section */}
                        <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
                            <Box sx={{ width: 120, height: 120, margin: 'auto', border: '1px dashed grey', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: imagePreview ? `url(${imagePreview}) center center/cover` : '#f0f0f0' }}>
                                {!imagePreview && <PhotoCamera sx={{ fontSize: 40, color: 'grey' }} />}
                            </Box>
                             <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 1 }}>
                                 Upload your Photo Thumbnail here. Supported format: jpg, jpeg, or png
                             </Typography>
                             <Button
                                 variant="outlined"
                                 component="label"
                                 size="small"
                                 startIcon={<CloudUploadIcon />}
                                 sx={{ mt: 1 }}
                             >
                                 Upload Image
                                 <input type="file" hidden accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} />
                             </Button>
                         </Grid>

                        {/* Form Fields */}
                        <Grid item xs={12} sm={6}>
                            <TextField required fullWidth label="Name" name="name" value={studentData.name} onChange={handleChange} size="small" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                             <FormControl fullWidth required size="small">
                                 <InputLabel id="class-select-label">Class</InputLabel>
                                 <Select labelId="class-select-label" label="Class" name="class" value={studentData.class} onChange={handleChange}>
                                     {classes.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                 </Select>
                             </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                             <FormControl fullWidth required size="small">
                                 <InputLabel id="course-select-label">Course</InputLabel>
                                 <Select labelId="course-select-label" label="Course" name="course" value={studentData.course} onChange={handleChange}>
                                     {courses.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                 </Select>
                             </FormControl>
                         </Grid>
                         <Grid item xs={12} sm={6}>
                             <TextField required fullWidth label="Email address" name="email" type="email" value={studentData.email} onChange={handleChange} size="small" />
                         </Grid>
                         <Grid item xs={12} sm={6}>
                             <TextField required fullWidth label="Phone number" name="phone" value={studentData.phone} onChange={handleChange} size="small" />
                         </Grid>
                         <Grid item xs={12} sm={6}>
                             <TextField required fullWidth label="Password" name="password" type="password" value={studentData.password} onChange={handleChange} size="small" />
                         </Grid>
                     </Grid>
                     {/* Add Another & Submit Buttons - Handled in DialogActions */}
                     <input type="submit" hidden /> {/* Allows submitting form via button in actions */}
                 </Box>
             </DialogContent>
            <DialogActions sx={{ p: '16px 24px', justifyContent: 'space-between' }}>
                 <Button onClick={() => console.log('Add another clicked')} startIcon={<AddIcon />}>Add another</Button>
                <Button type="submit" onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#25cf9d', '&:hover': { backgroundColor: '#1da884' } }}>Add student</Button>
            </DialogActions>
        </Dialog>
    );
};
// --- End Add Student Dialog ---


// --- Students Table Component ---
function StudentsTableToolbar(props) {
  const { onSearchChange, searchTerm, onAddStudentClick } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e0e0e0'
      }}
    >
      <Typography sx={{ flex: '1 1 100%', fontWeight: 'bold' }} variant="h6" component="div">
        Students
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by Student Name...."
          value={searchTerm}
          onChange={onSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'action.active' }} />
              </InputAdornment>
            ),
            sx: { borderRadius: '8px', backgroundColor: '#F9FAFB' }
          }}
          sx={{ width: '300px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#E5E7EB' }}}}
        />
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add Student">
          <IconButton onClick={onAddStudentClick}>
            <PersonAddAlt1Icon />
          </IconButton>
        </Tooltip>
      </Box>
    </Toolbar>
  );
}

export default function Students() {
  const [students, setStudents] = useState(studentsData); // Use mock data initially
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Add useEffect for actual data fetching here if needed

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtering logic
  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStudent = (id) => {
    console.log('Edit student:', id);
    // Add edit logic (e.g., open a dialog with pre-filled data)
  };

  const handleDeleteStudent = (id) => {
    console.log('Delete student:', id);
    // Add delete logic (API call, update state)
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const handleOpenAddDialog = () => {
      setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
      setOpenAddDialog(false);
  };

  const handleAddStudent = (newStudentData) => {
      console.log("Adding student:", newStudentData);
      // Add logic to send data to API
      // For now, add to mock data with a temp ID
      const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
      setStudents(prev => [...prev, { ...newStudentData, id: newId, avatar: '/static/images/avatar/default.jpg' }])
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* <Typography variant="h5" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2, fontWeight: 'bold' }}>
        <GroupIcon sx={{ mr: 1 }} /> Students & Instructors // Title might be handled by sidebar link
      </Typography> */}

      <Paper sx={{ width: '100%', mb: 2, borderRadius: '12px', overflow: 'hidden' }}>
        <StudentsTableToolbar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onAddStudentClick={handleOpenAddDialog}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="studentsTableTitle">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: '#F9FAFB' } }}>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((row) => {
                const statusProps = getStatusChipProps(row.status);
                return (
                  <TableRow hover key={row.id}>
                    <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar alt={row.name} src={row.avatar} sx={{ width: 32, height: 32, mr: 1.5 }} />
                      {row.name}
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.course}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusProps.label}
                        color={statusProps.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                         <IconButton size="small" onClick={() => handleEditStudent(row.id)}>
                           <EditIcon fontSize="small" />
                         </IconButton>
                       </Tooltip>
                       <Tooltip title="Delete">
                         <IconButton size="small" onClick={() => handleDeleteStudent(row.id)} sx={{ color: 'error.main' }}>
                           <DeleteIcon fontSize="small" />
                         </IconButton>
                       </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredStudents.length === 0 && (
                 <TableRow>
                     <TableCell colSpan={5} align="center">No students found.</TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Add Pagination if needed */}
      </Paper>

       <AddStudentDialog
          open={openAddDialog}
          handleClose={handleCloseAddDialog}
          handleAddStudent={handleAddStudent}
       />
    </Box>
  );
} 