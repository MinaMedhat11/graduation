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
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { visuallyHidden } from '@mui/utils'; // تأكد من وجود هذه الأداة المساعدة أو قم بإزالتها إذا لم تكن ضرورية

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// PersonOffIcon and PersonIcon are not used in the provided snippet, remove if not needed elsewhere
// import PersonOffIcon from '@mui/icons-material/PersonOff';
// import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// استيراد مكون Loading الخاص بك
import Loading from '../../Loading/Loading.jsx'; // تأكد من المسار الصحيح لمكون Loading
import AddUserModal from './AddUserModal'; // تأكد من المسار الصحيح

// Sorting helpers
function descendingComparator(a, b, orderBy) {
    const valA = a[orderBy] === null || a[orderBy] === undefined ? '' : String(a[orderBy]).toLowerCase();
    const valB = b[orderBy] === null || b[orderBy] === undefined ? '' : String(b[orderBy]).toLowerCase();
    if (valB < valA) return -1;
    if (valB > valA) return 1;
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilized = array.map((el, index) => [el, index]);
    stabilized.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        return order !== 0 ? order : a[1] - b[1];
    });
    return stabilized.map(el => el[0]);
}

const headCells = [
    // { id: 'avatar', numeric: false, disablePadding: true, label: '', sortable: false}, // For Avatar
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' }, // Changed disablePadding to false for consistency
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'role', numeric: false, disablePadding: false, label: 'Role' },
    { id: 'dateJoined', numeric: false, disablePadding: false, label: 'Date Joined' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'actions', numeric: true, disablePadding: false, label: 'Actions', sortable: false }, // Align right for actions
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    return (
        <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: 'grey.100' } }}>
                <TableCell padding="checkbox" sx={{ width: '60px' }}> {/* Avatar Placeholder or Checkbox */}
                    {/* <Checkbox indeterminate={numSelected > 0 && numSelected < rowCount} checked={rowCount > 0 && numSelected === rowCount} onChange={onSelectAllClick} /> */}
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
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
                        ) : (
                            headCell.label
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function AdminUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);
    const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    const [selectedRole, setSelectedRole] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [roles, setRoles] = useState(['All']);
    const [statuses, setStatuses] = useState(['All']);

    const [deletingUserId, setDeletingUserId] = useState(null);
    // const [addingUser, setAddingUser] = useState(false); // Uncomment if you want a global loading for add

    useEffect(() => {
        const fetchUsers = async () => {
            setInitialLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("Authentication token not found. Please log in.");
                    setInitialLoading(false);
                    return;
                }
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json'
                };

                const [studentRes, instructorRes] = await Promise.all([
                    fetch('http://127.0.0.1:8000/api/student/', { headers }),
                    fetch('http://127.0.0.1:8000/api/instructor/', { headers }),
                ]);

                if (!studentRes.ok) throw new Error(`Failed to fetch students: ${studentRes.status} ${studentRes.statusText}`);
                const studentData = await studentRes.json();
                
                if (!instructorRes.ok) throw new Error(`Failed to fetch instructors: ${instructorRes.status} ${instructorRes.statusText}`);
                const instructorData = await instructorRes.json();

                const studentMap = {};
                if (studentData.data && Array.isArray(studentData.data)) {
                    studentData.data.forEach((stu) => {
                        const studentApiId = stu.id || stu.student_id;
                        const key = stu.student_email || `student-noemail-${studentApiId || Math.random()}`;

                        if (!studentMap[key]) {
                            studentMap[key] = {
                                id: studentApiId ? `student-${studentApiId}` : `student-temp-${key}`,
                                name: stu.student_name || 'N/A',
                                email: stu.student_email || 'N/A',
                                role: 'Student',
                                status: stu.status === 1 || stu.status === 'active' ? 'Active' : 'Inactive',
                                dateJoined: stu.created_at ? new Date(stu.created_at).toLocaleDateString() : 'Unknown',
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(stu.student_name || 'S')}&background=random&color=fff`,
                                apiIds: studentApiId ? [studentApiId] : [],
                            };
                        } else {
                            if (studentApiId && !studentMap[key].apiIds.includes(studentApiId)) {
                                studentMap[key].apiIds.push(studentApiId);
                            }
                        }
                    });
                }
                const finalStudentUsers = Object.values(studentMap);

                const instructorMap = {};
                if (instructorData.data && Array.isArray(instructorData.data)) {
                    instructorData.data.forEach((inst) => {
                        const instructorApiId = inst.id || inst.instructor_id;
                        const email = inst.instructor_email || inst.email || `instructor-noemail-${instructorApiId || Math.random()}`;

                        if (!instructorMap[email]) {
                            instructorMap[email] = {
                                id: instructorApiId ? `instructor-${instructorApiId}` : `instructor-temp-${email}`,
                                apiId: instructorApiId,
                                name: inst.instructor_name || inst.name || 'N/A',
                                email: email || 'N/A',
                                role: 'Instructor',
                                status: inst.status === 1 || inst.status === 'active' ? 'Active' : 'Inactive',
                                dateJoined: inst.created_at ? new Date(inst.created_at).toLocaleDateString() : 'Unknown',
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(inst.instructor_name || inst.name || 'I')}&background=random&color=fff`,
                            };
                        }
                    });
                }
                const finalInstructorUsers = Object.values(instructorMap);

                const combinedUsers = [...finalStudentUsers, ...finalInstructorUsers];
                setUsers(combinedUsers);

                const uniqueRoles = ['All', ...new Set(combinedUsers.map(user => user.role))];
                const uniqueStatuses = ['All', ...new Set(combinedUsers.map(user => user.status))];
                setRoles(uniqueRoles.sort());
                setStatuses(uniqueStatuses.sort());

            } catch (err) {
                console.error('API Error fetching users:', err);
                setError(err.message || 'Failed to load user data. Please check your network connection and try again.');
                setUsers([]);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
        setPage(0);
    };

    const handleFilterMenuClick = (event) => setFilterMenuAnchorEl(event.currentTarget);
    const handleFilterMenuClose = () => setFilterMenuAnchorEl(null);

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
        // setCurrentUserId(null); // Keep currentUserId if an action might still be pending
    };

    const handleEdit = () => {
        if (!currentUserId) return;
        const userToEdit = users.find(u => u.id === currentUserId);
        console.log('Edit clicked for user:', userToEdit);
        // navigate(`/admin/user/edit/${currentUserId}`); // Implement navigation
        alert(`Edit action for ${userToEdit?.name}. Implement edit functionality.`);
        handleActionMenuClose();
    };

    const handleDelete = async () => {
        if (!currentUserId) return;

        const userToDelete = users.find((u) => u.id === currentUserId);
        if (!userToDelete) {
            handleActionMenuClose();
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`)) {
            handleActionMenuClose();
            return;
        }

        setDeletingUserId(currentUserId);
        handleActionMenuClose();

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Authentication token not found.");

            if (userToDelete.role === 'Student') {
                if (userToDelete.apiIds && userToDelete.apiIds.length > 0) {
                    const deleteRequests = userToDelete.apiIds.map((apiId) =>
                        fetch(`http://127.0.0.1:8000/api/student/delete/${apiId}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}`, 'Accept': 'application/json' },
                        })
                    );
                    const responses = await Promise.all(deleteRequests);
                    responses.forEach(async (res, index) => { // Make sure to await res.json() if needed
                        if (!res.ok) {
                            const errorData = await res.json().catch(() => ({})); // Try to get error message
                            console.warn(`Failed to delete student record with ID ${userToDelete.apiIds[index]}: ${res.statusText}`, errorData);
                        }
                    });
                } else {
                    console.warn("Student to delete has no API IDs to process or API did not return specific IDs.");
                }
            } else if (userToDelete.role === 'Instructor') {
                if (userToDelete.apiId) {
                    const res = await fetch(`http://127.0.0.1:8000/api/instructor/delete/${userToDelete.apiId}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}`, 'Accept': 'application/json' },
                    });
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(`Failed to delete instructor: ${res.statusText} - ${errorData.message || ''}`);
                    }
                } else {
                    console.warn("Instructor to delete has no API ID to process.");
                }
            }
            
            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== currentUserId));
            // You can add a success notification here
        } catch (err) {
            console.error('Failed to delete user:', err);
            alert(err.message || 'Failed to delete user. Please try again.');
        } finally {
            setDeletingUserId(null);
            setCurrentUserId(null); // Clear current user ID after action
        }
    };

    const filteredUsers = useMemo(() =>
        users.filter(user =>
            (user.name?.toLowerCase().includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm) ||
            user.role?.toLowerCase().includes(searchTerm)) &&
            (selectedRole === 'All' || user.role === selectedRole) &&
            (selectedStatus === 'All' || user.status === selectedStatus)
        ), [users, searchTerm, selectedRole, selectedStatus]
    );

    const visibleRows = useMemo(() =>
        stableSort(filteredUsers, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        ), [filteredUsers, order, orderBy, page, rowsPerPage]
    );

    const currentUserForMenu = users.find(u => u.id === currentUserId);

    const handleAddUserSuccess = (newUserFromModal) => {
        // The newUserFromModal should ideally have an ID (either from API or a temp one)
        // and all necessary fields.
        setUsers(prevUsers => {
            // If the new user has an ID that might already exist (e.g., from API after creation),
            // replace it. Otherwise, add to the beginning.
            const existingUserIndex = prevUsers.findIndex(u => u.id === newUserFromModal.id);
            if (existingUserIndex > -1) {
                const updatedUsers = [...prevUsers];
                updatedUsers[existingUserIndex] = newUserFromModal;
                return updatedUsers;
            }
            return [newUserFromModal, ...prevUsers];
        });
        setIsAddModalOpen(false);
        // Optionally, re-fetch all users if the add operation changes server-side IDs or counts significantly
        // fetchUsers(); 
    };

    if (initialLoading) {
        return <Loading message="Loading users, please wait..." />;
    }

    if (error && users.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error" variant="h6" gutterBottom>{error}</Typography>
                <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    User Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setIsAddModalOpen(true)}
                    disabled={deletingUserId !== null} // Disable if any delete is in progress
                >
                    Add New User
                </Button>
            </Box>

            <Paper sx={{ width: '100%', mb: 2, p: 2, borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search by name, email, role..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '8px', bgcolor: 'background.default' },
                        }}
                        sx={{ minWidth: { xs: '100%', sm: '300px' }, maxWidth: '450px', flexGrow: 1 }}
                    />
                    <Box>
                        <IconButton onClick={handleFilterMenuClick} title="Filter users">
                            <FilterListIcon />
                        </IconButton>
                        <Menu 
                            anchorEl={filterMenuAnchorEl} 
                            open={Boolean(filterMenuAnchorEl)} 
                            onClose={handleFilterMenuClose}
                            PaperProps={{ elevation: 2, sx: { mt: 1 } }}
                            MenuListProps={{ dense: true }}
                        >
                            <Typography variant="overline" display="block" sx={{ px: 2, pt: 1, pb: 0.5, color: 'text.secondary' }}>Filter by Role</Typography>
                            {roles.map(role => (
                                <MenuItem key={role} selected={role === selectedRole} onClick={() => handleRoleFilterChange(role)}>{role}</MenuItem>
                            ))}
                            <Divider sx={{ my: 0.5 }} />
                            <Typography variant="overline" display="block" sx={{ px: 2, pt: 1, pb: 0.5, color: 'text.secondary' }}>Filter by Status</Typography>
                            {statuses.map(status => (
                                <MenuItem key={status} selected={status === selectedStatus} onClick={() => handleStatusFilterChange(status)}>{status}</MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Box>

                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                        <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                        <TableBody>
                            {visibleRows.map((row) => {
                                const isDeleting = deletingUserId === row.id;
                                return (
                                    <TableRow 
                                        hover 
                                        key={row.id}
                                        sx={{
                                            opacity: isDeleting ? 0.5 : 1,
                                            pointerEvents: isDeleting ? 'none' : 'auto',
                                            '&:last-child td, &:last-child th': { border: 0 }
                                        }}
                                    >
                                        <TableCell padding="checkbox" sx={{ width: '60px' }}>
                                            <Avatar src={row.avatar} alt={row.name} sx={{ width: 36, height: 36 }} />
                                        </TableCell>
                                        <TableCell component="th" scope="row" sx={{py: 1.5}}> {/* Adjusted padding */}
                                            <Typography variant="subtitle2" fontWeight="medium">{row.name}</Typography>
                                        </TableCell>
                                        <TableCell sx={{py: 1.5}}><Typography variant="body2" color="text.secondary">{row.email}</Typography></TableCell>
                                        <TableCell sx={{py: 1.5}}><Typography variant="body2">{row.role}</Typography></TableCell>
                                        <TableCell sx={{py: 1.5}}><Typography variant="body2" color="text.secondary">{row.dateJoined}</Typography></TableCell>
                                        <TableCell sx={{py: 1.5}}>
                                            <Chip 
                                                label={row.status} 
                                                color={row.status === 'Active' ? 'success' : 'default'} 
                                                size="small" 
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="right" sx={{py: 1.5}}>
                                            {isDeleting ? (
                                                <CircularProgress size={24} />
                                            ) : (
                                                <IconButton 
                                                    onClick={(e) => handleActionMenuClick(e, row.id)} 
                                                    size="small"
                                                    title="Actions"
                                                    disabled={deletingUserId !== null} // Disable if any delete is in progress
                                                >
                                                    <MoreVertIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {!initialLoading && visibleRows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={headCells.length + 1} align="center" sx={{ py: 5 }}>
                                        {users.length === 0 && !error ? ( // Check for error state as well
                                            <Typography variant="subtitle1">No users available.</Typography>
                                        ) : error ? (
                                            <Typography variant="subtitle1" color="error">{error}</Typography>
                                        ) : (
                                            <Typography variant="subtitle1">No users match your current search/filter.</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
                />
            </Paper>

            <Menu 
                anchorEl={actionMenuAnchorEl} 
                open={Boolean(actionMenuAnchorEl)} 
                onClose={handleActionMenuClose}
                PaperProps={{ elevation: 2, sx: { mt: 1 } }}
                MenuListProps={{ dense: true }}
            >
                <MenuItem 
                    onClick={handleEdit} 
                    disabled={!currentUserId || deletingUserId === currentUserId}
                >
                    <EditIcon fontSize="small" sx={{ mr: 1.5 }} /> Edit User
                </MenuItem>
                {/* Add other actions like activate/deactivate here if needed */}
                <Divider sx={{ my: 0.5 }} />
                <MenuItem 
                    onClick={handleDelete} 
                    sx={{ color: 'error.main' }}
                    disabled={!currentUserId || deletingUserId === currentUserId}
                >
                    <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} /> 
                    {deletingUserId === currentUserId ? 'Deleting...' : 'Delete User'}
                </MenuItem>
            </Menu>

            {isAddModalOpen && (
                <AddUserModal 
                    open={isAddModalOpen} 
                    onClose={() => setIsAddModalOpen(false)} 
                    onAddUser={handleAddUserSuccess} // Pass the success handler
                />
            )}
        </Box>
    );
}
