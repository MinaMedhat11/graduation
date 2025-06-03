import React, { useEffect, useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    TextField,
    InputAdornment,
    IconButton,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { visuallyHidden } from '@mui/utils';
import Loading from '../../Loading/Loading.jsx'; // تأكد من المسار

// Helper functions for sorting
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
    const stabilized = array.map((el, index) => [el, index]);
    stabilized.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        return order !== 0 ? order : a[1] - b[1];
    });
    return stabilized.map((el) => el[0]);
}

// Table Head definition
const headCells = [
    { id: 'name', label: 'Course Name' },
    { id: 'duration', label: 'Course Duration (hrs)', numeric: true },
    { id: 'students', label: 'Total Students', numeric: true },
    { id: 'supposedWatchTime', label: 'Total Supposed Watch Time (hrs)', numeric: true },
    { id: 'watchTime', label: 'Actual Watch Time (hrs)', numeric: true },
    { id: 'averageWatchTime', label: 'Average Watch Time (hrs)', numeric: true },
];

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
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
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// Main Component
export default function CourseProgress() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // TODO: replace with your real API
        const fetchCourses = async () => {
            setLoading(true);
            try {
                // Simulated data (replace with API call)
                const response = [
                    {
                        id: 1,
                        name: 'Data Structures & Algorithms',
                        duration: 22,
                        students: 10,
                        supposedWatchTime: 220,
                        watchTime: 193,
                        averageWatchTime: 19.3
                    },
                    {
                        id: 2,
                        name: 'Database Systems',
                        duration: 17,
                        students: 8,
                        supposedWatchTime: 136,
                        watchTime: 87,
                        averageWatchTime: 10.875
                    },
                    {
                        id: 3,
                        name: 'Introduction to Programming',
                        duration: 15,
                        students: 19,
                        supposedWatchTime: 285,
                        watchTime: 196,
                        averageWatchTime: 10.315
                    },
                    {
                        id: 4,
                        name: 'Introduction to Artifitial Intelligence',
                        duration: 13,
                        students: 23,
                        supposedWatchTime: 299,
                        watchTime: 270,
                        averageWatchTime: 11.739
                    }
                ];
                setCourses(response);
            } catch (err) {
                setError('Failed to load course data.');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
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

    const filteredCourses = useMemo(() => {
        return courses.filter((course) =>
            course.name.toLowerCase().includes(searchTerm)
        );
    }, [courses, searchTerm]);

    const visibleRows = useMemo(() => {
        return stableSort(filteredCourses, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );
    }, [filteredCourses, order, orderBy, page, rowsPerPage]);

    if (loading) {
        return <Loading message="Loading course progress..." />;
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error" variant="h6">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Course Progress Report
            </Typography>
            <Paper sx={{ p: 2 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 2
                }}>
                    <TextField
                        size="small"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
                <TableContainer>
                    <Table size="medium">
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {visibleRows.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell align="right">{row.duration}</TableCell>
                                    <TableCell align="right">{row.students}</TableCell>
                                    <TableCell align="right">{row.supposedWatchTime}</TableCell>
                                    <TableCell align="right">{row.watchTime}</TableCell>
                                    <TableCell align="right">{row.averageWatchTime}</TableCell>
                                </TableRow>
                            ))}
                            {filteredCourses.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography>No matching courses found.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
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