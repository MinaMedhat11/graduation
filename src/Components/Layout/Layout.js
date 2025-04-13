import React, { useState } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
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

// Import MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People'; // Enrollments
import GroupIcon from '@mui/icons-material/Group'; // Students & Instructors
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ChatIcon from '@mui/icons-material/Chat'; // Import Chat icon

// Placeholder Logo - replace with actual image/component if available
import logoPlaceholder from '../../Images/Logo.png'; // Corrected capitalization


const drawerWidth = 240;
const appBarHeight = 64; // Typical AppBar height

const Layout = () => {
  const location = useLocation(); // For active link highlighting
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Sidebar items definition
  const sidebarItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Courses', icon: <SchoolIcon />, path: '/courses' },
    { text: 'Assignment', icon: <AssignmentIcon />, path: '/assignments' },
    { text: 'Payments', icon: <PaymentIcon />, path: '/payments' },
    { text: 'Lectures', icon: <MenuBookIcon />, path: '/lectures' },
    { text: 'Chat', icon: <ChatIcon />, path: '/chat' }, // Added Chat link
    // { text: 'Enrollments', icon: <PeopleIcon />, path: '/enrollments' }, // Keep commented if not implemented
    // { text: 'Students & Instructors', icon: <GroupIcon />, path: '/users' }, // Keep commented if not implemented
  ];

  // Determine active state based on current path
   const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* AppBar (Header) */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: '#ffffff',
          color: 'rgba(0, 0, 0, 0.87)',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          height: `${appBarHeight}px`,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left side: Greeting */}
           <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 500 }}>
             Hello Adam 👋 {/* Placeholder name */}
           </Typography>

          {/* Right side: Search, Notifications, Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search your course here..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: '8px', backgroundColor: '#F0F4F8' } // Rounded corners and background
              }}
              sx={{ width: '300px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: 'transparent' }, '&.Mui-focused fieldset': { borderColor: 'primary.main' }}}} // Hide border initially
            />
            <IconButton color="inherit" aria-label="notifications">
              <NotificationsNoneOutlinedIcon />
            </IconButton>
            <Box sx={{ flexGrow: 0 }}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {/* Replace with actual user image */}
                    <Avatar alt="Adam" src="/static/images/avatar/2.jpg" />
                </IconButton>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    {/* Add RouterLink for navigation if needed */}
                    <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                     <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">Setting</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer (Sidebar) */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#EAF0F7', // Slightly updated sidebar color based on images
            borderRight: 'none',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* Sidebar Header (Logo) */}
        <Toolbar sx={{ height: `${appBarHeight}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '16px !important', paddingRight: '16px !important' }}>
           {/* Replace Typography with actual Logo Image */}
           {/* <img src={logoPlaceholder} alt="Logo" style={{ height: '40px', objectFit: 'contain' }} /> */}
            <Typography variant="h6" sx={{ color: '#1D4ED8', fontWeight: 'bold' }}>EDUCATION</Typography> {/* Placeholder Text Logo */}
        </Toolbar>
        <Divider />
        {/* Sidebar Navigation List */}
        <List sx={{ paddingTop: '16px' }}>
          {sidebarItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block', marginBottom: '8px' }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={isActive(item.path)} // Highlight active link
                sx={{
                  minHeight: 48,
                  justifyContent: 'initial',
                  px: 2.5,
                  mx: 2, // Margin horizontal for inset look
                  borderRadius: '8px', // Rounded corners
                  backgroundColor: isActive(item.path) ? '#25cf9d' : 'transparent', // Active background color
                  color: isActive(item.path) ? '#ffffff' : '#374151', // Active/inactive text color
                  '&:hover': {
                    backgroundColor: isActive(item.path) ? '#25cf9d' : '#DDE6ED', // Hover background
                     color: isActive(item.path) ? '#ffffff' : '#111827', // Hover text color
                  },
                  '&.Mui-selected': { // Ensure selected styles override others
                     backgroundColor: '#25cf9d',
                     color: '#ffffff',
                     '&:hover': {
                        backgroundColor: '#1da884' // Slightly darker hover for active
                     }
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3, // Margin right for icon spacing
                    justifyContent: 'center',
                    color: 'inherit', // Inherit color from ListItemButton
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ sx: { fontWeight: 500, color: 'inherit' } }}
                 />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#F9FAFB', // Main content background color
          p: 3, // Padding around content
          mt: `${appBarHeight}px`, // Margin top to offset AppBar
          width: `calc(100% - ${drawerWidth}px)`, // Ensure content takes remaining width
          minHeight: `calc(100vh - ${appBarHeight}px)` // Ensure content area fills viewport height
        }}
      >
        {/* Outlet renders the matched child route component */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 