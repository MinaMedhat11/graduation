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
import Divider from '@mui/material/Divider';
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Mock Data for Admin Courses
const mockCourses = [
    { id: 'c1', title: 'Advanced React Masterclass', category: 'Programming', instructor: 'John Doe', price: 99.99, status: 'Published', students: 1500, dateCreated: '2024-01-10' },
    { id: 'c2', title: 'Introduction to UI/UX Design', category: 'Design', instructor: 'Jane Smith', price: 49.99, status: 'Published', students: 850, dateCreated: '2024-02-15' },
    { id: 'c3', title: 'Data Science with Python', category: 'Data Science', instructor: 'Alice Brown', price: 129.99, status: 'Draft', students: 0, dateCreated: '2024-03-20' },
    { id: 'c4', title: 'Complete Node.js Developer Course', category: 'Programming', instructor: 'Bob White', price: 89.99, status: 'Published', students: 1100, dateCreated: '2023-11-05' },
    { id: 'c5', title: 'Digital Marketing Fundamentals', category: 'Marketing', instructor: 'Charlie Green', price: 39.99, status: 'Published', students: 2500, dateCreated: '2024-01-25' },
    { id: 'c6', title: 'Cloud Computing Basics (AWS)', category: 'IT & Software', instructor: 'John Doe', price: 79.99, status: 'Draft', students: 0, dateCreated: '2024-04-01' },
];

// Extract unique categories and statuses for filter options
const categories = ['All', ...new Set(mockCourses.map(course => course.category))];
const statuses = ['All', ...new Set(mockCourses.map(course => course.status))];

// Helper function for sorting
function descendingComparator(a, b, orderBy) {
  if (orderBy === 'students') {
    return b[orderBy] - a[orderBy];
  }
  if (String(b[orderBy]).toLowerCase() < String(a[orderBy]).toLowerCase()) return -1;
  if (String(b[orderBy]).toLowerCase() > String(a[orderBy]).toLowerCase()) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Stable sort function
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
  { id: 'title', numeric: false, disablePadding: false, label: 'Course Title' },
  { id: 'category', numeric: false, disablePadding: false, label: 'Category' },
  { id: 'instructor', numeric: false, disablePadding: false, label: 'Instructor' },
  { id: 'students', numeric: true, disablePadding: false, label: 'Students' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'actions', numeric: true, disablePadding: false, label: 'Actions', sortable: false },
];

// Styled Table Head
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  '& .MuiTableCell-root': {
    fontWeight: 'bold',
  },
}));

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <StyledTableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {headCell.sortable !== false ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </StyledTableHead>
  );
}

// Helper function to get chip props based on status
const getStatusChipProps = (status) => {
  switch (status) {
    case 'Published':
      return { label: 'Published', color: 'success', variant: 'outlined' };
    case 'Draft':
      return { label: 'Draft', color: 'default', variant: 'outlined' };
    default:
      return { label: status, color: 'default', variant: 'outlined' };
  }
};

export default function AdminCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(mockCourses);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

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

  const handleCategoryFilterChange = (category) => {
    setSelectedCategory(category);
    setPage(0);
    handleFilterMenuClose();
  };

  const handleStatusFilterChange = (status) => {
    setSelectedStatus(status);
    setPage(0);
    handleFilterMenuClose();
  };

  const handleActionMenuClick = (event, courseId) => {
    setActionMenuAnchorEl(event.currentTarget);
    setCurrentCourseId(courseId);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
    setCurrentCourseId(null);
  };
  
  const handleEdit = () => {
    if (!currentCourseId) return;
    console.log('Edit clicked for course:', currentCourseId);
    navigate(`/admin/course/edit/${currentCourseId}`);
    handleActionMenuClose();
  };

  const handleDelete = () => {
    if (!currentCourseId) return;
    console.log('Delete clicked for course:', currentCourseId);
    setCourses(prev => prev.filter(course => course.id !== currentCourseId));
    handleActionMenuClose();
  };

  const handleTogglePublish = () => {
    if (!currentCourseId) return;
    console.log('Toggle publish clicked for course:', currentCourseId);
    setCourses(prev => prev.map(course => 
        course.id === currentCourseId 
        ? { ...course, status: course.status === 'Published' ? 'Draft' : 'Published' } 
        : course
    ));
    handleActionMenuClose();
  };

  const handleAddNewCourse = () => {
    navigate('/admin/course/add');
  };

  const filteredCourses = useMemo(() => 
    courses.filter(course => 
      (course.title.toLowerCase().includes(searchTerm) ||
       course.category.toLowerCase().includes(searchTerm) ||
       course.instructor.toLowerCase().includes(searchTerm))
      &&
      (selectedCategory === 'All' || course.category === selectedCategory)
      &&
      (selectedStatus === 'All' || course.status === selectedStatus)
    ),
    [courses, searchTerm, selectedCategory, selectedStatus]
  );

  const visibleRows = useMemo(() =>
    stableSort(filteredCourses, getComparator(order, orderBy)).slice(
      page * rowsPerPage, page * rowsPerPage + rowsPerPage,
    ),
    [filteredCourses, order, orderBy, page, rowsPerPage]
  );

  const currentCourseForMenu = courses.find(c => c.id === currentCourseId);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredCourses.length) : 0;

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Courses
        </Typography>
        <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNewCourse}
        >
            Add Course
        </Button>
       </Box>

      <Paper sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, flexWrap: 'wrap', gap: 1 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search Courses..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: '8px', bgcolor: 'background.paper' }
            }}
            sx={{ maxWidth: '400px', flexGrow: 1 }}
          />
          <Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterListIcon />}
              onClick={handleFilterMenuClick}
              sx={{ mr: 1, borderRadius: '8px' }}
            >
              Filter
            </Button>
            <Menu
              anchorEl={filterMenuAnchorEl}
              open={Boolean(filterMenuAnchorEl)}
              onClose={handleFilterMenuClose}
              MenuListProps={{ 'aria-labelledby': 'basic-button' }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>Filter by Category</Typography>
              {categories.map((category) => (
                <MenuItem
                  key={category}
                  selected={category === selectedCategory}
                  onClick={() => handleCategoryFilterChange(category)}
                >
                  {category}
                </MenuItem>
              ))}
              <Divider sx={{ my: 0.5 }} />
              <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>Filter by Status</Typography>
              {statuses.map((status) => (
                <MenuItem
                  key={status}
                  selected={status === selectedStatus}
                  onClick={() => handleStatusFilterChange(status)}
                >
                  {status}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={false}
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="normal"
                    >
                      {row.title}
                    </TableCell>
                    <TableCell align="left">{row.category}</TableCell>
                    <TableCell align="left">{row.instructor}</TableCell>
                    <TableCell align="right">{row.students.toLocaleString()}</TableCell>
                    <TableCell align="left">
                      <Chip {...getStatusChipProps(row.status)} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="actions"
                        onClick={(event) => handleActionMenuClick(event, row.id)}
                        size="small"
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={headCells.length} />
                </TableRow>
              )}
              {visibleRows.length === 0 && !courses.length && (
                 <TableRow>
                    <TableCell colSpan={headCells.length} align="center" sx={{ py: 3 }}>
                        No courses found. Start by adding a new course.
                    </TableCell>
                 </TableRow>
              )}
               {visibleRows.length === 0 && courses.length > 0 && (
                 <TableRow>
                    <TableCell colSpan={headCells.length} align="center" sx={{ py: 3 }}>
                        No courses match your current filters.
                    </TableCell>
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
          sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
        />
      </Paper>

       <Menu
        id="course-action-menu"
        anchorEl={actionMenuAnchorEl}
        open={Boolean(actionMenuAnchorEl)}
        onClose={handleActionMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
       >
         <MenuItem onClick={handleEdit} disabled={!currentCourseId}>
           <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
         </MenuItem>
         <MenuItem onClick={handleTogglePublish} disabled={!currentCourseId}>
            {currentCourseForMenu?.status === 'Published' ? (
                <VisibilityOffIcon fontSize="small" sx={{ mr: 1 }} />
            ) : (
                <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
            )}
            {currentCourseForMenu?.status === 'Published' ? 'Unpublish' : 'Publish'}
         </MenuItem>
         <Divider sx={{ my: 0.5 }} />
         <MenuItem onClick={handleDelete} disabled={!currentCourseId} sx={{ color: 'error.main' }}>
           <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
         </MenuItem>
       </Menu>
    </Box>
  );
} 