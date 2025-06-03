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
import CategoryIcon from '@mui/icons-material/Category';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';

// API Service
const apiService = {
  fetchMajors: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://127.0.0.1:8000/api/major/index', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch majors');
    }
    return await response.json();
  },
  addMajor: async (majorData) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://127.0.0.1:8000/api/major/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(majorData),
    });
    if (!response.ok) {
      throw new Error('Failed to add major');
    }
    return await response.json();
  },
  deleteMajor: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://127.0.0.1:8000/api/major/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Auth ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete major');
    }
    return await response.json();
  }
};

// Add Major Dialog Component
const AddMajorDialog = ({ open, handleClose, handleAddMajor }) => {
  const [majorData, setMajorData] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMajorData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await handleAddMajor(majorData);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
              <TextField
                required
                fullWidth
                label="Major Name"
                name="title"
                value={majorData.title}
                onChange={handleChange}
                size="small"
              />
            </Grid>
            
          </Grid>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px', justifyContent: 'space-between' }}>
        <Button onClick={handleClose} startIcon={<CloseIcon />}>
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ backgroundColor: '#25cf9d', '&:hover': { backgroundColor: '#1da884' } }}
        >
          {loading ? <CircularProgress size={24} /> : 'Add Major'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Majors Table Toolbar Component
function MajorsTableToolbar({ onSearchChange, searchTerm, onAddMajorClick }) {
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
            startAdrip: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'action.active' }} />
              </InputAdornment>
            ),
            sx: { borderRadius: '8px', backgroundColor: '#F9FAFB' }
          }}
          sx={{ width: '300px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#E5E7EB' } } }}
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

// Main Component
export default function Majors() {
  const [majors, setMajors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)
  const fetchMajors = async () => {
    setLoading(true);
    try {
      const response = await apiService.fetchMajors();
      setMajors(response.major.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddMajor = async (newMajor) => {
    await apiService.addMajor(newMajor);
    fetchMajors(); // Refresh the list
  };

  const handleDeleteMajor = async (id) => {
    try {
      await apiService.deleteMajor(id);
      fetchMajors(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMajors();
  }, []);

  const filteredMajors = majors.filter(major =>
    major.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    major.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2, fontWeight: 'bold' }}>
        <CategoryIcon sx={{ mr: 1 }} /> Majors
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Paper sx={{ width: '100%', mb: 2, borderRadius: '12px', overflow: 'hidden' }}>
        <MajorsTableToolbar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onAddMajorClick={() => setOpenDialog(true)}
        />

        <TableContainer>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table sx={{ minWidth: 750 }} aria-labelledby="majorsTableTitle">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: '#F9FAFB' } }}>
                  <TableCell>Major Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMajors.map((major) => (
                  <TableRow hover key={major.id}>
                    <TableCell component="th" scope="row">
                      {major.title}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 400, whiteSpace: 'normal' }}>
                      {major.description}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => console.log('Edit:', major.id)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteMajor(major.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMajors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      {loading ? 'Loading...' : 'No majors found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      <AddMajorDialog
        open={openAddDialog}
        handleClose={() => setOpenDialog(false)}
        handleAddMajor={handleAddMajor}
      />
    </Box>
  );
}