import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Loading from '../Loading/Loading';
import styles from './Courses.module.css';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  IconButton,
  Tooltip,
  Rating,
  Chip,
  Typography,
  TextField,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const headCells = [
  { id: 'id', numeric: true, disablePadding: true, label: 'ID' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Course Name' },
  { id: 'instructor', numeric: false, disablePadding: false, label: 'Instructor' },
  { id: 'students_enrolled', numeric: true, disablePadding: false, label: 'Students' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'rate', numeric: true, disablePadding: false, label: 'Rating' },
  { id: 'price', numeric: true, disablePadding: false, label: 'Price' },
  { id: 'end_date', numeric: false, disablePadding: false, label: 'End Date' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all courses' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props) {
  const { numSelected, searchTerm, onSearchChange, onAddCourse } = props;

  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6" component="div">
        Courses
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Search courses..."
          value={searchTerm}
          onChange={onSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
        <IconButton onClick={onAddCourse} color="primary">
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default function Courses() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name'); // Default sort by name
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching logic (kept from original component, adjust API endpoint/token handling if needed)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // --- MOCK DATA GENERATION (Remove when API is ready) ---
        const mockData = Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Course ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) || ''} - Topic ${i % 5}`,
            instructor: `Instructor ${String.fromCharCode(70 + (i % 10))}`,
            students_enrolled: Math.floor(Math.random() * 500) + 50,
            status: ['Active', 'Inactive'][i % 2],
            rate: Math.floor(Math.random() * 4) + 1 + Math.random(), // Rating between 1 and 5
            price: (Math.random() * 100 + 50).toFixed(2),
            end_date: `2025-12-${String(1 + (i % 30)).padStart(2, '0')}`,
        }));
        setCourses(mockData);
        setFilteredCourses(mockData);
        // --- END MOCK DATA ---

        // --- REAL API CALL (Uncomment when ready) ---
        // const token = localStorage.getItem('token');
        // if (!token) {
        //     console.error('Authentication token not found.');
        //     // Handle missing token (e.g., redirect to login)
        //     return;
        // }
        // const response = await axios.get('http://127.0.0.1:8000/api/courses/', {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // // Assuming response.data.data is the array of courses
        // // Add dummy data if API doesn't provide all needed fields yet
        // const coursesData = response.data.data.map((course, index) => ({
        //     ...course,
        //     id: course.id || index + 1, // Ensure unique ID
        //     instructor: course.instructor_name || 'N/A', // Example placeholder
        //     students_enrolled: course.students_count || Math.floor(Math.random() * 100), // Example placeholder
        //     status: course.status || ['Active', 'Inactive'][index % 2], // Example placeholder
        //     rate: course.rating || Math.random() * 5, // Example placeholder
        //     price: course.price || (Math.random() * 100 + 20).toFixed(2), // Example placeholder
        //     end_date: course.end_date || 'N/A' // Example placeholder
        // }));
        // setCourses(coursesData);
        // setFilteredCourses(coursesData);
         // --- END REAL API CALL ---

      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddCourse = () => {
    // Implementation for adding a course
  };

  const handleEditCourse = (id) => {
    // Implementation for editing a course
  };

  const handleDeleteCourse = (id) => {
    // Implementation for deleting a course
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredCourses.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredCourses.length) : 0;

  const visibleRows = useMemo(
    () => filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredCourses, page, rowsPerPage]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, borderRadius: '12px', overflow: 'hidden' }}>
        <EnhancedTableToolbar
            numSelected={selected.length}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onAddCourse={handleAddCourse}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredCourses.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none" align="right">
                      {row.id} {/* Or calculate sequential number based on page/rowsPerPage */}
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.instructor}</TableCell>
                    <TableCell align="right">{row.students_enrolled}</TableCell>
                    <TableCell align="left">
                      <Chip
                        label={row.status}
                        color={row.status === 'Active' ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                     <TableCell align="right">
                         <Rating name={`rating-${row.id}`} value={row.rate} precision={0.5} readOnly size="small" />
                     </TableCell>
                    <TableCell align="right">${row.price}</TableCell>
                    <TableCell align="left">{row.end_date}</TableCell>
                    <TableCell align="left">
                       <Tooltip title="Edit">
                         <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditCourse(row.id); }}>
                           <EditIcon fontSize="small" />
                         </IconButton>
                       </Tooltip>
                       <Tooltip title="Delete">
                         <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteCourse(row.id); }} sx={{ color: 'error.main' }}>
                           <DeleteIcon fontSize="small" />
                         </IconButton>
                       </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={headCells.length + 1} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCourses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
