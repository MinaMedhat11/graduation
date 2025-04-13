import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Keep for potential future use (e.g., Add Course button)

// MUI Components
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';

// MUI Icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

// Helper function for stable sorting
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Define Table Head Cells
const headCells = [
  { id: '#', numeric: true, disablePadding: false, label: '#' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'instructor', numeric: false, disablePadding: false, label: 'Instructor' },
  { id: 'students_enrolled', numeric: true, disablePadding: false, label: 'Students Enrolled' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'rate', numeric: true, disablePadding: false, label: 'Rate' },
  { id: 'price', numeric: true, disablePadding: false, label: 'Price' },
  { id: 'end_date', numeric: false, disablePadding: false, label: 'End Date' },
  { id: 'action', numeric: false, disablePadding: false, label: 'Action', sortDisabled: true },
];

// Enhanced Table Head Component
function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow sx={{ '& th': { backgroundColor: '#F3F4F6', fontWeight: 'bold' } }}>
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
            {headCell.sortDisabled ? (
               headCell.label
            ) : (
                <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                >
                {headCell.label}
                </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// Enhanced Table Toolbar Component
function EnhancedTableToolbar(props) {
  const { numSelected, onSearchChange, searchTerm, onAddCourse } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        // Highlight toolbar if rows are selected (optional)
        // ...(numSelected > 0 && {
        //   bgcolor: (theme) => theme.palette.action.activatedOpacity,
        // }),
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e0e0e0'
      }}
    >
         <Typography
           sx={{ flex: '1 1 100%', fontWeight: 'bold' }}
           variant="h6"
           id="tableTitle"
           component="div"
         >
           All Courses
         </Typography>

       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
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
              sx={{ width: '250px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#E5E7EB' }}}} // Subtle border
          />
          <Tooltip title="Filter list">
              <IconButton>
                  <FilterListIcon />
              </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="primary" // Use theme's primary color
            startIcon={<AddIcon />}
            onClick={onAddCourse} // Add handler
            sx={{ backgroundColor: '#25cf9d', '&:hover': { backgroundColor: '#1da884' } }} // Specific green color from design
          >
            Add Course
          </Button>
       </Box>

      {/* Optional: Show delete action when items are selected */}
      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null} */}
    </Toolbar>
  );
}

export default function Courses() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name'); // Default sort by name
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]); // Store fetched courses
  const [filteredCourses, setFilteredCourses] = useState([]); // Store courses after filtering

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
        // Add user feedback here (e.g., using react-toastify)
      }
    };

    fetchCourses();
  }, []);

  // Search/Filtering Logic
   useEffect(() => {
     const lowerCaseSearchTerm = searchTerm.toLowerCase();
     const filtered = courses.filter(course =>
       (course.name?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
       (course.instructor?.toLowerCase() || '').includes(lowerCaseSearchTerm)
       // Add more fields to search if needed
     );
     setFilteredCourses(filtered);
     setPage(0); // Reset page when search term changes
   }, [searchTerm, courses]);


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

   const handleAddCourse = () => {
     // Navigate to Add Course page or open a modal
     console.log('Add Course clicked');
     // Example navigation: navigate('/courses/add');
   };

   const handleEditCourse = (id) => {
     console.log('Edit Course:', id);
     // Navigate to edit page or open modal
   };

   const handleDeleteCourse = (id) => {
     console.log('Delete Course:', id);
     // Implement delete logic (API call, update state)
   };


  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredCourses.length) : 0;

  // Memoize the sorted and paginated data
   const visibleRows = useMemo(() =>
       stableSort(filteredCourses, getComparator(order, orderBy)).slice(
         page * rowsPerPage, page * rowsPerPage + rowsPerPage,
       ),
     [filteredCourses, order, orderBy, page, rowsPerPage]
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
