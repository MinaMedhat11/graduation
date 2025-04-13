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
import Chip from '@mui/material/Chip';
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
import CategoryIcon from '@mui/icons-material/Category'; // Title Icon
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

// Mock Data
const majorsData = [
    { id: 1, name: 'Back-End', description: 'This course is your best way to learn mobile app development for Android and Apple', coursesCount: 10 },
    { id: 2, name: 'Mobile Application', description: 'This course is your best way to learn mobile app development for Android and Apple', coursesCount: 14 },
    { id: 3, name: 'Front-End', description: 'This course is your best way to learn mobile app development for Android and Apple', coursesCount: 19 },
    { id: 4, name: 'Design', description: 'This course is your best way to learn mobile app development for Android and Apple', coursesCount: 10 },
    { id: 5, name: 'Artificial intelligence', description: 'This course is your best way to learn mobile app development for Android and Apple', coursesCount: 12 },
    { id: 6, name: 'Mobile Application', description: 'This course is your best way to learn mobile app development for Android and Apple', coursesCount: 12 },
    { id: 7, name: 'Front-End', description: 'This course is your best way to learn mobile app development for Android and Apple', coursesCount: 19 },
    { id: 8, name: 'Mobile Application', description: 'This course is your best way to learn mobile app development for Android and Apple', coursesCount: 10 },
    { id: 9, name: 'Front-End', description: 'This course is your best way to learn mobile app development for Android and Apple', coursesCount: 10 },
    { id: 10, name: 'Mobile Application', description: 'This course is your best way to learn mobile app development for Android and Apple', coursesCount: 10 },
];

// --- Add Major Dialog Component ---
const AddMajorDialog = ({ open, handleClose, handleAddMajor }) => {
    const [majorData, setMajorData] = useState({
        name: '',
        description: '',
        course: '', // Course field from the modal image
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setMajorData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleAddMajor(majorData);
        handleClose();
    };

    // Mock data for course dropdown in modal
    const courses = ['Course A', 'Course B', 'Course C'];

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Add Major
                <IconButton aria-label="close" onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                 <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                     <Grid container spacing={2}>
                         <Grid item xs={12}>
                             <TextField required fullWidth label="Major Name" name="name" value={majorData.name} onChange={handleChange} size="small" />
                         </Grid>
                         <Grid item xs={12}>
                            {/* Course dropdown - assuming it relates to the major? */}
                             <FormControl fullWidth size="small">
                                 <InputLabel id="course-select-modal-label">Course</InputLabel>
                                 <Select labelId="course-select-modal-label" label="Course" name="course" value={majorData.course} onChange={handleChange}>
                                     {courses.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                 </Select>
                             </FormControl>
                         </Grid>
                         <Grid item xs={12}>
                             <TextField
                                required
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                name="description"
                                value={majorData.description}
                                onChange={handleChange}
                                size="small"
                            />
                         </Grid>
                     </Grid>
                     <input type="submit" hidden />
                 </Box>
             </DialogContent>
            <DialogActions sx={{ p: '16px 24px', justifyContent: 'space-between' }}>
                 <Button onClick={() => console.log('Add another clicked')} startIcon={<AddIcon />}>Add another</Button>
                <Button type="submit" onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#25cf9d', '&:hover': { backgroundColor: '#1da884' } }}>Add Major</Button>
            </DialogActions>
        </Dialog>
    );
};
// --- End Add Major Dialog ---

// --- Majors Table Toolbar Component ---
function MajorsTableToolbar(props) {
  const { onSearchChange, searchTerm, onAddMajorClick } = props;

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
        Majors
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by Major Name...."
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
        <Button
            variant="contained"
            onClick={onAddMajorClick}
            startIcon={<AddIcon />}
            sx={{ backgroundColor: '#25cf9d', '&:hover': { backgroundColor: '#1da884' } }}
        >
             Add Major
        </Button>
      </Box>
    </Toolbar>
  );
}

export default function Majors() {
  const [majors, setMajors] = useState(majorsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Add useEffect for actual data fetching here

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtering logic
  const filteredMajors = majors.filter(major =>
    major.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    major.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditMajor = (id) => {
    console.log('Edit major:', id);
    // Add edit logic (e.g., open dialog with data)
  };

  const handleDeleteMajor = (id) => {
    console.log('Delete major:', id);
    setMajors(prev => prev.filter(m => m.id !== id));
  };

  const handleOpenAddDialog = () => {
      setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
      setOpenAddDialog(false);
  };

  const handleAddMajor = (newMajorData) => {
      console.log("Adding major:", newMajorData);
      // Add logic to send data to API
      const newId = majors.length > 0 ? Math.max(...majors.map(m => m.id)) + 1 : 1;
      // The mock data needs 'coursesCount', Add Major modal doesn't provide it
      setMajors(prev => [...prev, { ...newMajorData, id: newId, coursesCount: 0 }])
  };

  return (
    <Box sx={{ width: '100%' }}>
       <Typography variant="h5" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2, fontWeight: 'bold' }}>
           <CategoryIcon sx={{ mr: 1 }} /> Majors
       </Typography>

      <Paper sx={{ width: '100%', mb: 2, borderRadius: '12px', overflow: 'hidden' }}>
        <MajorsTableToolbar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onAddMajorClick={handleOpenAddDialog}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="majorsTableTitle">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: '#F9FAFB' } }}>
                <TableCell>Major Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Courses</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMajors.map((row) => (
                  <TableRow hover key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 400, whiteSpace: 'normal' }}>{row.description}</TableCell> {/* Allow wrapping */}
                    <TableCell align="center">
                        <Chip label={row.coursesCount} size="small" sx={{ fontWeight: 500 }}/>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                         <IconButton size="small" onClick={() => handleEditMajor(row.id)}>
                           <EditIcon fontSize="small" />
                         </IconButton>
                       </Tooltip>
                       <Tooltip title="Delete">
                         <IconButton size="small" onClick={() => handleDeleteMajor(row.id)} sx={{ color: 'error.main' }}>
                           <DeleteIcon fontSize="small" />
                         </IconButton>
                       </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMajors.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} align="center">No majors found.</TableCell>
                    </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Add Pagination if needed */}
      </Paper>

       <AddMajorDialog
          open={openAddDialog}
          handleClose={handleCloseAddDialog}
          handleAddMajor={handleAddMajor}
       />
    </Box>
  );
} 