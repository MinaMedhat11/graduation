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
import Avatar from '@mui/material/Avatar'; // For user avatar
import Divider from '@mui/material/Divider'; // For filter menu

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonOffIcon from '@mui/icons-material/PersonOff'; // Deactivate
import PersonIcon from '@mui/icons-material/Person'; // Activate
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Import the modal
import AddUserModal from './AddUserModal';

// Mock Data for Admin Users
const mockUsers = [
    { id: 'u1', name: 'Alice Wonderland', email: 'alice@example.com', role: 'Student', status: 'Active', dateJoined: '2024-01-15', avatar: '/static/images/avatar/1.jpg' },
    { id: 'u2', name: 'Bob The Builder', email: 'bob@example.com', role: 'Instructor', status: 'Active', dateJoined: '2023-11-01', avatar: '/static/images/avatar/2.jpg' },
    { id: 'u3', name: 'Charlie Chaplin', email: 'charlie@example.com', role: 'Student', status: 'Inactive', dateJoined: '2024-02-20', avatar: '/static/images/avatar/3.jpg' },
    { id: 'u4', name: 'Diana Prince', email: 'diana@example.com', role: 'Student', status: 'Active', dateJoined: '2024-03-10', avatar: '/static/images/avatar/4.jpg' },
    { id: 'u5', name: 'Edward Scissorhands', email: 'edward@example.com', role: 'Instructor', status: 'Active', dateJoined: '2023-12-05', avatar: '/static/images/avatar/5.jpg' },
    { id: 'u6', name: 'Fiona Shrek', email: 'fiona@example.com', role: 'Student', status: 'Active', dateJoined: '2024-04-01', avatar: '/static/images/avatar/6.jpg' },
];

// Extract unique roles and statuses for filter options
const roles = ['All', ...new Set(mockUsers.map(user => user.role))];
const statuses = ['All', ...new Set(mockUsers.map(user => user.status))];

// --- Sorting Helper Functions (descendingComparator, getComparator, stableSort) --- 
// (Reusing the same functions as in AdminCourses)
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
// --- End Sorting Helpers ---

// Table Head Columns Definition for Users
const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'role', numeric: false, disablePadding: false, label: 'Role' },
  { id: 'dateJoined', numeric: false, disablePadding: false, label: 'Date Joined' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions', sortable: false },
];

// Reusable EnhancedTableHead component (assuming structure is similar enough)
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
        <TableCell padding="checkbox">
          {/* Checkbox placeholder */}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
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
    </TableHead>
  );
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockUsers);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null); 
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null); 
  const [currentUserId, setCurrentUserId] = useState(null); 
  // State for filters
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  // State for Add User Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const handleRoleFilterChange = (role) => {
    setSelectedRole(role);
    setPage(0);
    handleFilterMenuClose();
  };

  const handleStatusFilterChange = (status) => {
    setSelectedStatus(status);
    setPage(0);
    handleFilterMenuClose();
  };

  const handleActionMenuClick = (event, userId) => {
    setActionMenuAnchorEl(event.currentTarget);
    setCurrentUserId(userId);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
    setCurrentUserId(null);
  };
  
  // --- Action Handlers ---
  const handleEdit = () => {
    console.log('Edit clicked for user:', currentUserId);
    // navigate(`/admin/user/edit/${currentUserId}`); // Navigate to user edit page (if exists)
    handleActionMenuClose();
  };

  const handleDelete = () => {
    console.log('Delete clicked for user:', currentUserId);
    setUsers(prev => prev.filter(user => user.id !== currentUserId));
    handleActionMenuClose();
  };

  const handleToggleActive = () => {
    console.log('Toggle active clicked for user:', currentUserId);
    setUsers(prev => prev.map(user => 
        user.id === currentUserId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } 
        : user
    ));
    handleActionMenuClose();
  };

  // Handler for adding a user from the modal
  const handleAddUser = (newUser) => {
    setUsers(prevUsers => [newUser, ...prevUsers]); // Add new user to the beginning of the list
    // TODO: In a real app, you'd likely refetch the user list or update based on API response
  };
  // --- End Action Handlers ---

  const filteredUsers = useMemo(() => 
    users.filter(user => 
      // Search term filter
      (user.name.toLowerCase().includes(searchTerm) ||
       user.email.toLowerCase().includes(searchTerm) ||
       user.role.toLowerCase().includes(searchTerm))
      &&
      // Role filter
      (selectedRole === 'All' || user.role === selectedRole)
      &&
      // Status filter
      (selectedStatus === 'All' || user.status === selectedStatus)
    ),
    [users, searchTerm, selectedRole, selectedStatus]
  );

  const visibleRows = useMemo(() =>
    stableSort(filteredUsers, getComparator(order, orderBy)).slice(
      page * rowsPerPage, page * rowsPerPage + rowsPerPage,
    ),
    [filteredUsers, order, orderBy, page, rowsPerPage]
  );

  const currentUserForMenu = users.find(u => u.id === currentUserId);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        User Management
      </Typography>
      <Paper sx={{ width: '100%', mb: 2, p: 2, borderRadius: '12px' }}>
        {/* Header with Search, Filter, Add Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
           <TextField
            variant="outlined"
            size="small"
            placeholder="Search Users (Name, Email, Role)..."
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
               sx: { borderRadius: '8px' }
            }}
            sx={{ minWidth: '300px' }}
          />
           <Box>
             <IconButton onClick={handleFilterMenuClick} aria-label="filter list">
               <FilterListIcon />
             </IconButton>
             <Menu
                 id="filter-menu-user"
                 anchorEl={filterMenuAnchorEl}
                 open={Boolean(filterMenuAnchorEl)}
                 onClose={handleFilterMenuClose}
              >
                 <MenuItem disabled><Typography variant="caption">Filter by Role</Typography></MenuItem>
                 {roles.map(role => (
                    <MenuItem 
                       key={role}
                       selected={role === selectedRole}
                       onClick={() => handleRoleFilterChange(role)}
                     >
                        {role}
                     </MenuItem>
                 ))}
                  <Divider />
                  <MenuItem disabled><Typography variant="caption">Filter by Status</Typography></MenuItem>
                  {statuses.map(status => (
                     <MenuItem 
                        key={status}
                        selected={status === selectedStatus}
                        onClick={() => handleStatusFilterChange(status)}
                      >
                         {status}
                      </MenuItem>
                  ))}
              </Menu>
             <Button 
                 variant="contained" 
                 startIcon={<AddIcon />} 
                 onClick={() => setIsAddModalOpen(true)} // Open modal on click
                 sx={{ ml: 1 }}
             >
               Add User
             </Button>
           </Box>
         </Box>

        {/* User Table */}
         <TableContainer>
           <Table sx={{ minWidth: 750 }} aria-labelledby="userTableTitle">
             <EnhancedTableHead
               order={order}
               orderBy={orderBy}
               onRequestSort={handleRequestSort}
               rowCount={filteredUsers.length}
             />
             <TableBody>
               {visibleRows.map((row, index) => {
                 const labelId = `user-table-checkbox-${index}`;
                 return (
                   <TableRow hover tabIndex={-1} key={row.id}>
                     <TableCell padding="checkbox">
                        {/* Checkbox placeholder */}
                     </TableCell>
                     <TableCell component="th" id={labelId} scope="row" padding="none" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar alt={row.name} src={row.avatar} sx={{ width: 32, height: 32, mr: 1.5 }} />
                       {row.name}
                     </TableCell>
                     <TableCell>{row.email}</TableCell>
                     <TableCell>{row.role}</TableCell>
                     <TableCell>{new Date(row.dateJoined).toLocaleDateString()}</TableCell>
                     <TableCell>
                       <Chip 
                          label={row.status} 
                          color={row.status === 'Active' ? 'success' : 'default'} 
                          size="small" 
                        />
                     </TableCell>
                     <TableCell align="right">
                       <IconButton
                         aria-label="more actions"
                         onClick={(event) => handleActionMenuClick(event, row.id)}
                       >
                         <MoreVertIcon />
                       </IconButton>
                     </TableCell>
                   </TableRow>
                 );
               })}
               {filteredUsers.length === 0 && (
                 <TableRow>
                   <TableCell colSpan={6} align="center">No users found.</TableCell>
                 </TableRow>
               )}
             </TableBody>
           </Table>
         </TableContainer>
         <TablePagination
           rowsPerPageOptions={[5, 10, 25]}
           component="div"
           count={filteredUsers.length}
           rowsPerPage={rowsPerPage}
           page={page}
           onPageChange={handleChangePage}
           onRowsPerPageChange={handleChangeRowsPerPage}
         />
          {/* Action Menu for each user row */}
          <Menu
             id="user-actions-menu"
             anchorEl={actionMenuAnchorEl}
             open={Boolean(actionMenuAnchorEl)}
             onClose={handleActionMenuClose}
           >
             <MenuItem onClick={handleEdit}><EditIcon sx={{mr: 1}} fontSize="small"/> Edit</MenuItem>
             <MenuItem onClick={handleToggleActive}>
                 {currentUserForMenu?.status === 'Active' ? <PersonOffIcon sx={{mr: 1}} fontSize="small"/> : <PersonIcon sx={{mr: 1}} fontSize="small"/>}
                  {currentUserForMenu?.status === 'Active' ? 'Deactivate' : 'Activate'}
             </MenuItem>
             <MenuItem onClick={handleDelete} sx={{color: 'error.main'}}><DeleteIcon sx={{mr: 1}} fontSize="small"/> Delete</MenuItem>
           </Menu>
      </Paper>

      {/* Add User Modal Render */}
      <AddUserModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddUser={handleAddUser}
      />

    </Box>
  );
} 