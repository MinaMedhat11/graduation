import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider'; // For filter menu
import { styled } from '@mui/material/styles'; // Import styled for custom table head

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import GradeIcon from '@mui/icons-material/Grade'; // Grade action

// Mock Data for Submissions
const mockSubmissions = [
    { submissionId: 's1', assignmentTitle: 'React Lifecycle Essay', course: 'Introduction to React', studentName: 'Alice Wonderland', submittedAt: '2024-08-14T10:30:00Z', status: 'Submitted' }, // Needs Grading
    { submissionId: 's2', assignmentTitle: 'Data Structures Quiz', course: 'CS Fundamentals', studentName: 'Charlie Chaplin', submittedAt: '2024-08-15T09:00:00Z', status: 'Submitted' }, // Needs Grading
    { submissionId: 's3', assignmentTitle: 'Wireframe Design Task', course: 'UI/UX Design Basics', studentName: 'Diana Prince', submittedAt: '2024-08-13T15:00:00Z', status: 'Graded', grade: '90/100' },
    { submissionId: 's4', assignmentTitle: 'React Lifecycle Essay', course: 'Introduction to React', studentName: 'Fiona Shrek', submittedAt: '2024-08-14T11:00:00Z', status: 'Submitted' }, // Needs Grading
    { submissionId: 's5', assignmentTitle: 'Node.js API Project', course: 'Backend Development', studentName: 'Alice Wonderland', submittedAt: '2024-08-16T08:30:00Z', status: 'Late' }, // Late, but needs grading
    { submissionId: 's6', assignmentTitle: 'Node.js API Project', course: 'Backend Development', studentName: 'Gaston LeGume', submittedAt: '2024-08-17T09:30:00Z', status: 'Graded', grade: '75/100' },
];

// Extract unique courses and statuses for filtering
const courses = ['All', ...new Set(mockSubmissions.map(sub => sub.course))];
// Define status filter options explicitly based on design/logic
const statuses = ['All', 'Needs Grading', 'Graded', 'Late', 'Submitted'];

// --- Sorting Helper Functions (reuse from AdminCourses/AdminUsers) ---
// Removed the first set of commented-out definitions
// function descendingComparator(a, b, orderBy) { /* ... */ }
// function getComparator(order, orderBy) { /* ... */ }
// function stableSort(array, comparator) { /* ... */ }
// --- End Sorting Helpers (Implementations omitted for brevity, assume they exist) ---

// Keep the actual implementations
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


// Table Head Columns Definition
const headCells = [
  { id: 'assignmentTitle', numeric: false, disablePadding: false, label: 'Assignment' }, // Adjusted padding
  { id: 'studentName', numeric: false, disablePadding: false, label: 'Student' },
  { id: 'course', numeric: false, disablePadding: false, label: 'Course' },
  { id: 'submittedAt', numeric: false, disablePadding: false, label: 'Submitted Date' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions', sortable: false, align: 'center' }, // Center align actions
];

// Styled TableHead for background color
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100], // Light grey background for header
  '& .MuiTableCell-root': {
    fontWeight: 600, // Bolder head cells
  },
}));

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <StyledTableHead> {/* Use StyledTableHead */}
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || (headCell.numeric ? 'right' : 'left')}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable !== false ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            ) : headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </StyledTableHead>
  );
}

export default function AdminAssignmentSubmissions() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('submittedAt'); // Default sort by date
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);
  // State for filters
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All'); // Default to showing all

  // Add useEffect for fetching data if needed

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0);
  };

  const handleFilterMenuClick = (event) => {
    setFilterMenuAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchorEl(null);
  };

  const handleCourseFilterChange = (course) => {
      setSelectedCourse(course);
      setPage(0);
      handleFilterMenuClose();
  };

  const handleStatusFilterChange = (status) => {
      setSelectedStatus(status);
      setPage(0);
      handleFilterMenuClose();
  };

  const handleGradeClick = (submissionId) => {
      navigate(`/admin/grading/assignment/${submissionId}`);
  };

  // Helper to determine if a submission needs grading
  const needsGrading = (sub) => sub.status !== 'Graded';

  const filteredSubmissions = useMemo(() =>
    submissions.filter(sub =>
      // Search filter
      (sub.assignmentTitle.toLowerCase().includes(searchTerm) ||
       sub.studentName.toLowerCase().includes(searchTerm) ||
       sub.course.toLowerCase().includes(searchTerm))
       &&
       // Course filter
       (selectedCourse === 'All' || sub.course === selectedCourse)
       &&
       // Status filter logic
       (selectedStatus === 'All' ||
        (selectedStatus === 'Needs Grading' && needsGrading(sub)) || // Use helper
        (selectedStatus === 'Graded' && sub.status === 'Graded') ||
        (selectedStatus === 'Late' && sub.status === 'Late') ||
        (selectedStatus === 'Submitted' && sub.status === 'Submitted') // Handle explicit Submitted filter if needed
        // Note: 'Submitted' status might overlap with 'Needs Grading' or 'Late' depending on exact definitions
        )
    ),
    [submissions, searchTerm, selectedCourse, selectedStatus]
  );

  const visibleRows = useMemo(() =>
    stableSort(filteredSubmissions, getComparator(order, orderBy)).slice(
      page * rowsPerPage, page * rowsPerPage + rowsPerPage,
    ),
    [filteredSubmissions, order, orderBy, page, rowsPerPage]
  );

  const getStatusChip = (status) => {
        // Explicitly map status to chip props based on design/requirement
        switch (status?.toLowerCase()) {
            case 'submitted': return { label: 'Submitted', color: 'info' }; // Blue/Info for just submitted
            case 'graded': return { label: 'Graded', color: 'success' }; // Green for Graded
            case 'late': return { label: 'Late', color: 'warning' }; // Orange for Late
            // Consider adding other statuses if they exist (e.g., Pending Review, Failed)
            default: return { label: status || 'Unknown', color: 'default' }; // Grey fallback
        }
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}> {/* Add padding to Box */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Assignment Submissions
      </Typography>
      <Paper sx={{ width: '100%', mb: 2, p: { xs: 1, sm: 2 }, borderRadius: '12px', overflow: 'hidden' }}> {/* Ensure Paper has radius and handles overflow */}
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2, px: 1 }}> {/* Add padding to header box */}
           <TextField
            variant="outlined"
            size="small"
            placeholder="Search Submissions..."
            value={searchTerm} // Control the input
            onChange={handleSearchChange}
            InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                sx: { borderRadius: '8px', backgroundColor: 'white' } // Add background
             }}
            sx={{ minWidth: { xs: '100%', sm: '300px' }, flexGrow: { xs: 1, sm: 0 } }} // Responsive width
          />
           <Box>
             <IconButton onClick={handleFilterMenuClick} aria-label="filter list" sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: '8px', ml: 1 }}> {/* Styled filter button */}
               <FilterListIcon />
             </IconButton>
             <Menu
                 id="filter-menu-submissions"
                 anchorEl={filterMenuAnchorEl}
                 open={Boolean(filterMenuAnchorEl)}
                 onClose={handleFilterMenuClose}
                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Position menu below button
                 transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                 <MenuItem disabled><Typography variant="caption" sx={{ px: 2 }}>Filter by Course</Typography></MenuItem>
                 {courses.map(course => (
                    <MenuItem
                       key={course}
                       selected={course === selectedCourse}
                       onClick={() => handleCourseFilterChange(course)}
                       sx={{ px: 2 }} // Add padding
                     >
                        {course}
                     </MenuItem>
                 ))}
                  <Divider sx={{ my: 1 }} />
                  <MenuItem disabled><Typography variant="caption" sx={{ px: 2 }}>Filter by Status</Typography></MenuItem>
                  {statuses.map(status => (
                     <MenuItem
                        key={status}
                        selected={status === selectedStatus}
                        onClick={() => handleStatusFilterChange(status)}
                        sx={{ px: 2 }} // Add padding
                      >
                         {status}
                      </MenuItem>
                  ))}
              </Menu>
            {/* No 'Add' button needed here */}
           </Box>
         </Box>

        {/* Submissions Table */}
         <TableContainer> {/* Remove Paper wrapper if TableContainer handles it */}
           <Table sx={{ minWidth: 750 }} aria-labelledby="submissionsTableTitle">
             <EnhancedTableHead
               order={order}
               orderBy={orderBy}
               onRequestSort={handleRequestSort}
               rowCount={filteredSubmissions.length}
             />
             <TableBody>
               {visibleRows.map((row) => {
                 const { label: statusLabel, color: statusColor } = getStatusChip(row.status);
                 const isGraded = row.status === 'Graded';
                 return (
                     <TableRow hover tabIndex={-1} key={row.submissionId}>
                       <TableCell component="th" scope="row">
                         {row.assignmentTitle}
                       </TableCell>
                       <TableCell>{row.studentName}</TableCell>
                       <TableCell>{row.course}</TableCell>
                       <TableCell>{new Date(row.submittedAt).toLocaleDateString()}</TableCell> {/* Format date */}
                       <TableCell>
                         <Chip
                            label={statusLabel}
                            color={statusColor}
                            size="small"
                          />
                       </TableCell>
                       <TableCell align="center"> {/* Center align actions */}
                         <Button
                            variant="contained"
                            size="small"
                            color={isGraded ? "secondary" : "primary"} // Use secondary color for View
                            startIcon={<GradeIcon />}
                            onClick={() => handleGradeClick(row.submissionId)}
                            sx={{ borderRadius: '20px', textTransform: 'none' }} // Pill shape button
                         >
                            {isGraded ? 'View' : 'Grade'}
                         </Button>
                       </TableCell>
                     </TableRow>
                   );
                })}
               {visibleRows.length === 0 && ( /* Use visibleRows for empty check */
                 <TableRow>
                   <TableCell colSpan={headCells.length} align="center" sx={{ py: 4 }}> {/* Use headCells.length */}
                        <Typography color="text.secondary">No submissions found matching your criteria.</Typography>
                   </TableCell>
                 </TableRow>
               )}
             </TableBody>
           </Table>
         </TableContainer>
         <TablePagination
           rowsPerPageOptions={[5, 10, 25]}
           component="div"
           count={filteredSubmissions.length}
           rowsPerPage={rowsPerPage}
           page={page}
           onPageChange={handleChangePage}
           onRowsPerPageChange={handleChangeRowsPerPage}
           sx={{ borderTop: '1px solid', borderColor: 'divider' }} // Add top border
         />
      </Paper>
    </Box>
  );
} 