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
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

// Icons
import GroupIcon from '@mui/icons-material/Group'; // Placeholder Title Icon
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'; // Add instructor icon
import CloseIcon from '@mui/icons-material/Close';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Mock Data
const instructorsData = [
  { id: 1, name: 'Kristin Watson', email: 'ahmedfgdt132155156@yahoo.com', coursesAssigned: 'Network / Figma', avatar: '/static/images/avatar/1.jpg' },
  { id: 2, name: 'Marvin McKinney', email: 'ahmedfgdt132155156@yahoo.com', coursesAssigned: 'Back-end / Flutter', avatar: '/static/images/avatar/2.jpg' },
  { id: 3, name: 'Jane Cooper', email: 'ahmedfgdt132155156@yahoo.com', coursesAssigned: 'Figma UI', avatar: '/static/images/avatar/3.jpg' },
  { id: 4, name: 'Cody Fisher', email: 'ahmedfgdt132155156@yahoo.com', coursesAssigned: 'AI', avatar: '/static/images/avatar/4.jpg' },
  { id: 5, name: 'Bessie Cooper', email: 'ahmed@ya.com', coursesAssigned: 'Figma UI', avatar: '/static/images/avatar/5.jpg' },
  { id: 6, name: 'Leslie Alexander', email: 'ahmed@ya.com', coursesAssigned: 'Back-end / Flutter', avatar: '/static/images/avatar/6.jpg' },
  { id: 7, name: 'Guy Hawkins', email: 'ahmed@ya.com', coursesAssigned: 'Figma UI', avatar: '/static/images/avatar/7.jpg' },
  { id: 8, name: 'Theresa Webb', email: 'ahmed@ya.com', coursesAssigned: 'Figma UI', avatar: '/static/images/avatar/1.jpg' },
  { id: 9, name: 'Savannah Nguyen', email: 'ahmed@ya.com', coursesAssigned: 'Figma UI', avatar: '/static/images/avatar/3.jpg' },
  { id: 10, name: 'Kristin Watson', email: 'ahmed@ya.com', coursesAssigned: 'Figma UI', avatar: '/static/images/avatar/4.jpg' },
  { id: 11, name: 'Wade Warren', email: 'ahmed@ya.com', coursesAssigned: 'Figma UI', avatar: '/static/images/avatar/5.jpg' },
  { id: 12, name: 'Annette Black', email: 'ahmed@ya.com', coursesAssigned: 'Figma UI', avatar: '/static/images/avatar/6.jpg' },
];

// --- Add Instructor Dialog Component ---
const AddInstructorDialog = ({ open, handleClose, handleAddInstructor }) => {
    const [instructorData, setInstructorData] = useState({
        name: '',
        specialization: '',
        course: '',
        email: '',
        phone: '',
        password: '',
        // image: null
    });
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInstructorData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            // setInstructorData(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleAddInstructor(instructorData); // Pass data to parent handler
        handleClose(); // Close dialog after submission
    };

    // Mock data for dropdowns
    const specializations = ['Web Development', 'Mobile Development', 'Data Science', 'AI', 'UI/UX'];
    const courses = ['Figma UI', 'Flutter Basics', 'Advanced Networks', 'React Advanced'];

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Add Instructors
                <IconButton aria-label="close" onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                 <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Image Upload Section */}
                        <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
                            <Box sx={{ width: 120, height: 120, margin: 'auto', border: '1px dashed grey', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: imagePreview ? `url(${imagePreview}) center center/cover` : '#f0f0f0' }}>
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
                            <TextField required fullWidth label="Name" name="name" value={instructorData.name} onChange={handleChange} size="small" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                             <FormControl fullWidth required size="small">
                                 <InputLabel id="specialization-select-label">Specialization</InputLabel>
                                 <Select labelId="specialization-select-label" label="Specialization" name="specialization" value={instructorData.specialization} onChange={handleChange}>
                                     {specializations.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                 </Select>
                             </FormControl>
                        </Grid>
                         <Grid item xs={12} sm={6}>
                             <FormControl fullWidth required size="small">
                                 <InputLabel id="course-select-label">Course</InputLabel>
                                 <Select labelId="course-select-label" label="Course" name="course" value={instructorData.course} onChange={handleChange}>
                                     {courses.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                 </Select>
                             </FormControl>
                         </Grid>
                         <Grid item xs={12} sm={6}>
                             <TextField required fullWidth label="Email address" name="email" type="email" value={instructorData.email} onChange={handleChange} size="small" />
                         </Grid>
                         <Grid item xs={12} sm={6}>
                             <TextField required fullWidth label="Phone number" name="phone" value={instructorData.phone} onChange={handleChange} size="small" />
                         </Grid>
                         <Grid item xs={12} sm={6}>
                             <TextField required fullWidth label="Password" name="password" type="password" value={instructorData.password} onChange={handleChange} size="small" />
                         </Grid>
                     </Grid>
                     <input type="submit" hidden />
                 </Box>
             </DialogContent>
            <DialogActions sx={{ p: '16px 24px', justifyContent: 'space-between' }}>
                 <Button onClick={() => console.log('Add another clicked')} startIcon={<AddIcon />}>Add another</Button>
                <Button type="submit" onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#25cf9d', '&:hover': { backgroundColor: '#1da884' } }}>Add instructor</Button>
            </DialogActions>
        </Dialog>
    );
};
// --- End Add Instructor Dialog ---


// --- Instructors Table Component ---
function InstructorsTableToolbar(props) {
  const { onSearchChange, searchTerm, onAddInstructorClick } = props;

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
        Instructors
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by Instructor Name...."
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
        <Tooltip title="Add Instructor">
          <IconButton onClick={onAddInstructorClick}>
            <PersonAddAlt1Icon />
          </IconButton>
        </Tooltip>
      </Box>
    </Toolbar>
  );
}

export default function Instructors() {
  const [instructors, setInstructors] = useState(instructorsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Fetching logic would go here

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtering logic
  const filteredInstructors = instructors.filter(instructor =>
    instructor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditInstructor = (id) => {
    console.log('Edit instructor:', id);
    // Add edit logic
  };

  const handleDeleteInstructor = (id) => {
    console.log('Delete instructor:', id);
    setInstructors(prev => prev.filter(i => i.id !== id));
  };

  const handleOpenAddDialog = () => {
      setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
      setOpenAddDialog(false);
  };

  const handleAddInstructor = (newInstructorData) => {
      console.log("Adding instructor:", newInstructorData);
      // Add logic to send data to API
      const newId = instructors.length > 0 ? Math.max(...instructors.map(i => i.id)) + 1 : 1;
      setInstructors(prev => [...prev, { ...newInstructorData, id: newId, avatar: '/static/images/avatar/default.jpg' }])
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, borderRadius: '12px', overflow: 'hidden' }}>
        <InstructorsTableToolbar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onAddInstructorClick={handleOpenAddDialog}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="instructorsTableTitle">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: '#F9FAFB' } }}>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Courses Assigned</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInstructors.map((row) => (
                  <TableRow hover key={row.id}>
                    <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar alt={row.name} src={row.avatar} sx={{ width: 32, height: 32, mr: 1.5 }} />
                      {row.name}
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.coursesAssigned}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                         <IconButton size="small" onClick={() => handleEditInstructor(row.id)}>
                           <EditIcon fontSize="small" />
                         </IconButton>
                       </Tooltip>
                       <Tooltip title="Delete">
                         <IconButton size="small" onClick={() => handleDeleteInstructor(row.id)} sx={{ color: 'error.main' }}>
                           <DeleteIcon fontSize="small" />
                         </IconButton>
                       </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                 {filteredInstructors.length === 0 && (
                     <TableRow>
                         <TableCell colSpan={4} align="center">No instructors found.</TableCell>
                     </TableRow>
                 )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Add Pagination if needed */}
      </Paper>

       <AddInstructorDialog
          open={openAddDialog}
          handleClose={handleCloseAddDialog}
          handleAddInstructor={handleAddInstructor}
       />
    </Box>
  );
} 