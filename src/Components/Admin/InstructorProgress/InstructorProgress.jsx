import React, { useState, useMemo } from 'react';
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
import { visuallyHidden } from '@mui/utils';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Static data for instructors
const STATIC_INSTRUCTORS = [
    {
        id: 'instructor-1',
        name: 'Dr. Zeyad Mohamed',
        email: 'zeyad.mohamed@example.com',
        coursesCount: 15,
        averageWatchTime: 45.2,
        avatar: 'https://ui-avatars.com/api/?name=Dr.+Zeyad+Mohamed&background=4CAF50&color=fff',
        joinDate: '2023-01-15',
    },
    {
        id: 'instructor-2',
        name: 'Eng. Mina',
        email: 'mina_medhat@example.com',
        coursesCount: 8,
        averageWatchTime: 32.8,
        avatar: 'https://ui-avatars.com/api/?name=Eng.+Mina&background=2196F3&color=fff',
        joinDate: '2023-03-20',
    },
    {
        id: 'instructor-3',
        name: 'Mr. Ammar Eldeep',
        email: 'ammar.eldeep@example.com',
        coursesCount: 12,
        averageWatchTime: 38.5,
        avatar: 'https://ui-avatars.com/api/?name=Mr.+Ammar+Eldeep&background=FF9800&color=fff',
        joinDate: '2022-11-10',
    },
    {
        id: 'instructor-4',
        name: 'Eng. Youssef',
        email: 'youssef.elsheikh@example.com',
        coursesCount: 6,
        averageWatchTime: 28.3,
        avatar: 'https://ui-avatars.com/api/?name=Eng.+Youssef&background=9C27B0&color=fff',
        joinDate: '2023-05-08',
    },
];

// Sorting helpers
function descendingComparator(a, b, orderBy) {
    let valA, valB;
    
    if (orderBy === 'coursesCount') {
        valA = a[orderBy] || 0;
        valB = b[orderBy] || 0;
    } else if (orderBy === 'averageWatchTime') {
        valA = parseFloat(a[orderBy]) || 0;
        valB = parseFloat(b[orderBy]) || 0;
    } else {
        valA = a[orderBy] === null || a[orderBy] === undefined ? '' : String(a[orderBy]).toLowerCase();
        valB = b[orderBy] === null || b[orderBy] === undefined ? '' : String(b[orderBy]).toLowerCase();
    }
    
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
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'coursesCount', numeric: true, disablePadding: false, label: 'Courses Count' },
    { id: 'averageWatchTime', numeric: true, disablePadding: false, label: 'Average Watch Time (hrs)' },
    { id: 'performance', numeric: false, disablePadding: false, label: 'Performance', sortable: false },
    { id: 'actions', numeric: true, disablePadding: false, label: 'Actions', sortable: false },
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: 'grey.100' } }}>
                <TableCell padding="checkbox" sx={{ width: '60px' }}>
                    {/* Avatar column */}
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

// Helper function to get performance level
function getPerformanceLevel(watchTime) {
    if (watchTime >= 40) return { label: 'Excellent', color: 'success' };
    if (watchTime >= 30) return { label: 'Good', color: 'primary' };
    if (watchTime >= 20) return { label: 'Average', color: 'warning' };
    return { label: 'Needs Improvement', color: 'error' };
}

export default function InstructorProgress() {
    // Process static data with performance
    const instructors = STATIC_INSTRUCTORS.map(instructor => ({
        ...instructor,
        performance: getPerformanceLevel(instructor.averageWatchTime)
    }));

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('averageWatchTime');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);
    const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
    const [currentInstructorId, setCurrentInstructorId] = useState(null);
    const [selectedPerformance, setSelectedPerformance] = useState('All');

    const performanceLevels = ['All', 'Excellent', 'Good', 'Average', 'Needs Improvement'];

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

    const handlePerformanceFilterChange = (performance) => {
        setSelectedPerformance(performance);
        setPage(0);
        handleFilterMenuClose();
    };

    const handleActionMenuClick = (event, instructorId) => {
        setActionMenuAnchorEl(event.currentTarget);
        setCurrentInstructorId(instructorId);
    };

    const handleActionMenuClose = () => {
        setActionMenuAnchorEl(null);
        setCurrentInstructorId(null);
    };

    const handleViewDetails = () => {
        if (!currentInstructorId) return;
        const instructor = instructors.find(i => i.id === currentInstructorId);
        console.log('View details for instructor:', instructor);
        alert(`View detailed progress for ${instructor?.name}. Implement navigation to detailed view.`);
        handleActionMenuClose();
    };

    const filteredInstructors = useMemo(() =>
        instructors.filter(instructor =>
            (instructor.name?.toLowerCase().includes(searchTerm) ||
            instructor.email?.toLowerCase().includes(searchTerm)) &&
            (selectedPerformance === 'All' || instructor.performance.label === selectedPerformance)
        ), [instructors, searchTerm, selectedPerformance]
    );

    const visibleRows = useMemo(() =>
        stableSort(filteredInstructors, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        ), [filteredInstructors, order, orderBy, page, rowsPerPage]
    );

    const totalCourses = instructors.reduce((sum, inst) => sum + inst.coursesCount, 0);
    const averageWatchTime = instructors.length > 0 
        ? (instructors.reduce((sum, inst) => sum + inst.averageWatchTime, 0) / instructors.length).toFixed(1)
        : 0;

    return (
        <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Instructor Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Track instructor performance and course engagement
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RefreshIcon />}
                    onClick={() => window.location.reload()}
                >
                    Refresh Data
                </Button>
            </Box>

            {/* Statistics Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                    <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold">{instructors.length}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Instructors</Typography>
                </Paper>
                <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold">{totalCourses}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Courses</Typography>
                </Paper>
                <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                    <AccessTimeIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold">{averageWatchTime}h</Typography>
                    <Typography variant="body2" color="text.secondary">Avg Watch Time</Typography>
                </Paper>
            </Box>

            <Paper sx={{ width: '100%', mb: 2, p: 2, borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search by name or email..."
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
                        <IconButton onClick={handleFilterMenuClick} title="Filter by performance">
                            <FilterListIcon />
                        </IconButton>
                        <Menu 
                            anchorEl={filterMenuAnchorEl} 
                            open={Boolean(filterMenuAnchorEl)} 
                            onClose={handleFilterMenuClose}
                            PaperProps={{ elevation: 2, sx: { mt: 1 } }}
                            MenuListProps={{ dense: true }}
                        >
                            <Typography variant="overline" display="block" sx={{ px: 2, pt: 1, pb: 0.5, color: 'text.secondary' }}>
                                Filter by Performance
                            </Typography>
                            {performanceLevels.map(performance => (
                                <MenuItem 
                                    key={performance} 
                                    selected={performance === selectedPerformance} 
                                    onClick={() => handlePerformanceFilterChange(performance)}
                                >
                                    {performance}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Box>

                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                        <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                        <TableBody>
                            {visibleRows.map((row) => (
                                <TableRow 
                                    hover 
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell padding="checkbox" sx={{ width: '60px' }}>
                                        <Avatar src={row.avatar} alt={row.name} sx={{ width: 36, height: 36 }} />
                                    </TableCell>
                                    <TableCell component="th" scope="row" sx={{ py: 1.5 }}>
                                        <Typography variant="subtitle2" fontWeight="medium">{row.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{row.email}</Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 1.5 }}>
                                        <Typography variant="body2" fontWeight="medium">{row.coursesCount}</Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 1.5 }}>
                                        <Typography variant="body2" fontWeight="medium">{row.averageWatchTime}h</Typography>
                                    </TableCell>
                                    <TableCell sx={{ py: 1.5 }}>
                                        <Chip 
                                            label={row.performance.label} 
                                            color={row.performance.color} 
                                            size="small" 
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 1.5 }}>
                                        <IconButton 
                                            onClick={(e) => handleActionMenuClick(e, row.id)} 
                                            size="small"
                                            title="Actions"
                                        >
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {visibleRows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={headCells.length + 1} align="center" sx={{ py: 5 }}>
                                        <Typography variant="subtitle1">No instructors match your current search/filter.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredInstructors.length}
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
                <MenuItem onClick={handleViewDetails}>
                    <VisibilityIcon fontSize="small" sx={{ mr: 1.5 }} /> 
                    View Details
                </MenuItem>
            </Menu>
        </Box>
    );
}