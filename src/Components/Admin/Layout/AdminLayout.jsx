import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom'; // Use NavLink
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar'; // Rename to avoid conflict
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled, useTheme } from '@mui/material/styles';
// Removed duplicate react-router-dom import

// Import MUI Icons for Admin
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined'; // Use outlined for consistency
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined'; // For Lectures/Content
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'; // For Payments
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'; // Enrollments
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined'; // Students & Instructors

import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

// Use the same logo
import logoPlaceholder from '../../../Images/Logo.png'; // Adjust path relative to this file

const drawerWidth = 260; // Slightly wider drawer based on screenshots
const appBarHeight = 64;

// Styled AppBar to match design
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.background.paper, // White background
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1], // Subtle shadow
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

// Styled Drawer to match design
const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        borderRight: 'none',
        backgroundColor: '#F1F5F9', // Light grey/blue sidebar background
    },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center logo
    padding: theme.spacing(0, 1),
    height: appBarHeight,
    // ...theme.mixins.toolbar, // Not needed if AppBar is separate
}));

const AdminLayout = () => {
  const location = useLocation();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const theme = useTheme(); // Use theme
  const [open, setOpen] = React.useState(true); // Keep drawer open by default

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

    // Basic Logout handler
    const handleLogout = () => {
        console.log("Logout clicked");
        handleCloseUserMenu();
        // Add actual logout logic
    };

  // Admin Sidebar items definition - updated based on screenshots
  const sidebarItems = [
    { text: 'Dashboard', icon: <DashboardCustomizeOutlinedIcon />, path: '/admin/dashboard' },
    { text: 'Courses', icon: <SchoolOutlinedIcon />, path: '/admin/courses' },
    { text: 'Assignment', icon: <AssignmentTurnedInOutlinedIcon />, path: '/admin/assignments' },
    { text: 'Payments', icon: <PaymentOutlinedIcon />, path: '/admin/payments' }, // Assuming path exists
    { text: 'Lectures', icon: <BookOutlinedIcon />, path: '/admin/lectures' }, // Assuming path exists
    { text: 'Enrollments', icon: <PeopleAltOutlinedIcon />, path: '/admin/enrollments' }, // Assuming path exists
    { text: 'Students & Instructors', icon: <SupervisorAccountOutlinedIcon />, path: '/admin/users' }, // Combined path
    // { text: 'Majors', icon: <CategoryIcon />, path: '/admin/majors' }, // Example for Majors
  ];

  const isActive = (path) => {
     // Handle nested routes like course edit/add under courses
     if (path === '/admin/courses' && location.pathname.startsWith('/admin/course/')) {
         return true;
     }
     return location.pathname === path || (path !== '/admin/dashboard' && location.pathname.startsWith(path) && path !== '/admin');
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Use the styled AppBar */}
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Removed Title - Rely on page content for title */}
            <Box sx={{ width: 24 }}></Box> { /* Spacer */}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Search Bar - Styled to match */}
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search here..." // Generic placeholder
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
                sx: {
                    borderRadius: '30px', // Rounded
                    backgroundColor: theme.palette.background.default, // Use default background
                    width: '300px',
                    '& fieldset': { border: 'none' }, // No border
                 }
              }}
              sx={{ display: { xs: 'none', sm: 'block' } }}
            />
            <IconButton color="inherit" aria-label="notifications">
              <NotificationsNoneOutlinedIcon sx={{ color: theme.palette.text.secondary }}/>
            </IconButton>
            {/* User Menu */}
            <Box sx={{ flexGrow: 0 }}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {/* Use user data when available */}
                    <Avatar alt="Admin User" src="/static/images/avatar/1.jpg" />
                </IconButton>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar-admin"
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >                     {/* Use NavLink for Profile/Settings if they have routes */}
                     <MenuItem component={NavLink} to="/admin/profile" onClick={handleCloseUserMenu}>
                        <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
                        <ListItemText>Profile</ListItemText>
                    </MenuItem>
                     <MenuItem component={NavLink} to="/admin/settings" onClick={handleCloseUserMenu}>
                        <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Settings</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                    </MenuItem>
                </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Use the styled Drawer */}
      <StyledDrawer variant="permanent">
        <DrawerHeader>
          {/* Use actual logo */}
          <img src={logoPlaceholder} alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />
        </DrawerHeader>
        {/* No divider needed unless design requires */}
        <List sx={{ pt: 2, px: 1.5 }}> {/* Padding top and horizontal */}
          {sidebarItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 1 }}> {/* Margin bottom */}
              <ListItemButton
                component={NavLink}
                to={item.path}
                selected={isActive(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: 'initial', // Always show text
                  px: 2.5,
                  borderRadius: theme.shape.borderRadius, // Use theme radius
                  // Using MuiListItemButton overrides from theme.js for selected/hover
                  // Adjust icon color specifically if needed
                   '& .MuiListItemIcon-root': {
                        color: isActive(item.path) ? theme.palette.primary.contrastText : theme.palette.text.secondary, // White icon if active, secondary grey otherwise
                        minWidth: 0,
                        mr: 3,
                        justifyContent: 'center',
                   },
                   '& .MuiListItemText-root': {
                        color: isActive(item.path) ? theme.palette.primary.contrastText : theme.palette.text.primary, // White text if active, primary otherwise
                   }
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ sx: { fontWeight: 500 } }}
                 />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </StyledDrawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          backgroundColor: theme.palette.background.default, // Use theme default background
          flexGrow: 1,
          p: 3, // Standard padding
          mt: `${appBarHeight}px`, // Ensure content starts below app bar
          width: `calc(100% - ${drawerWidth}px)`,
          minHeight: `calc(100vh - ${appBarHeight}px)`,
          overflow: 'auto',
        }}
      >
        {/* <Toolbar /> // Toolbar spacer might not be needed with fixed AppBar & correct mt */}
        <Outlet />
      </Box>
    </Box>
  );
};

// Removed redundant DrawerHeader styled component definition

export default AdminLayout;