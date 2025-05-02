import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Loading from '../Loading/Loading';
import styles from './Courses.module.css';

export default function Courses() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name'); // Default sort by name
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);

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
