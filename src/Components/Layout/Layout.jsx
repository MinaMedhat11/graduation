import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
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
import { styled, useTheme } from '@mui/material/styles';

// Icons for User Layout
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School'; // Courses
import AssignmentIcon from '@mui/icons-material/Assignment'; // Assignment
import PaymentIcon from '@mui/icons-material/Payment'; // Payments
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'; // Lectures
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle'; // For Profile link in menu
import SettingsIcon from '@mui/icons-material/Settings'; // For Settings link in menu
import LogoutIcon from '@mui/icons-material/Logout'; // For Logout link in menu

// Use the same logo (assuming path is correct relative to this new file)
import logoPlaceholder from '../../Images/Logo.png';

const drawerWidth = 240;
const appBarHeight = 64; // Or adjust based on screenshot appearance

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
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
  // Match the design: White background, subtle shadow, etc.
  backgroundColor: '#ffffff',
  color: theme.palette.text.primary, // Adjust as needed
  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.05)', // Example shadow
}));


const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      borderRight: 'none', // Remove default border if needed
      backgroundColor: '#E0F2F1', // Example light teal background from screenshots
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center', // Center the logo
  padding: theme.spacing(0, 1),
  height: appBarHeight, // Match AppBar height
  ...theme.mixins.toolbar, // Necessary for content to be below app bar
}));


const Layout = () => {
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = useState(true); // Drawer starts open
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Basic Logout handler (implement actual logic later)
  const handleLogout = () => {
      console.log("Logout clicked");
      handleCloseUserMenu();
      // Add actual logout logic here (clear context/token, navigate to login)
  };

  // Sidebar items definition based on user screenshots and App.js routes
  const sidebarItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Courses', icon: <SchoolIcon />, path: '/courses' },
    { text: 'Assignment', icon: <AssignmentIcon />, path: '/assignments' }, // Ensure path matches App.js
    { text: 'Payments', icon: <PaymentIcon />, path: '/payments' },
    { text: 'Lectures', icon: <OndemandVideoIcon />, path: '/lectures' },
    // Add Enrollments, Students & Instructors if they are part of this user layout
    // { text: 'Enrollments', icon: <PeopleIcon />, path: '/enrollments' }, // Example
    // { text: 'Students & Instructors', icon: <GroupIcon />, path: '/manage-users' }, // Example
  ];

  // Function to check if a sidebar item is active
  const isActive = (path) => {
    // Exact match for dashboard,startsWith for others might be needed depending on sub-routes
    return location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Top App Bar */}
      <StyledAppBar position="fixed" open={open}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: appBarHeight }}>
           {/* Left side - Placeholder for potential drawer toggle or empty space */}
           <Box sx={{ width: open ? 0 : 60 }}></Box> {/* Adjust width to match closed drawer icon space */}

           {/* Right side - Search, Notifications, User Menu */}
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1, justifyContent: 'flex-end' }}>
               {/* Top Search Bar */}
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
                        sx: {
                            borderRadius: '30px', // Make it rounded
                            backgroundColor: '#F8F9FA', // Light background
                            width: '350px', // Adjust width as needed
                            '& fieldset': { border: 'none' }, // Remove border
                        }
                    }}
                    sx={{ display: { xs: 'none', sm: 'block' } }} // Hide on small screens if needed
                />
                <IconButton color="inherit" aria-label="notifications">
                  <NotificationsNoneOutlinedIcon />
                </IconButton>
                {/* User Avatar and Menu */}
                <Box sx={{ flexGrow: 0 }}>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        {/* Replace with actual user data */}
                        <Avatar alt="User Name" src="/static/images/avatar/2.jpg" />
                    </IconButton>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem component={NavLink} to="/profile" onClick={handleCloseUserMenu}>
                            <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
                            <ListItemText>Profile</ListItemText>
                        </MenuItem>
                        <MenuItem component={NavLink} to="/settings" onClick={handleCloseUserMenu}> {/* Assuming a /settings route */}
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
      </StyledAppBar>

      {/* Sidebar Drawer */}
      <StyledDrawer variant="permanent" open={open}>
        <DrawerHeader>
          {/* Logo */}
          <img src={logoPlaceholder} alt="Education Your Tagline" style={{ height: '40px', objectFit: 'contain' }} />
        </DrawerHeader>
        {/* Removed Divider, Drawer Toggle - Add if needed based on final design */}
        <List sx={{ pt: 2 }}> {/* Add padding top */}
          {sidebarItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block', px: 1.5 }}> {/* Padding for list items */}
              <ListItemButton
                component={NavLink}
                to={item.path}
                selected={isActive(item.path)} // Use selected prop for styling
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  mb: 1, // Margin bottom for spacing
                  borderRadius: '8px', // Rounded corners
                  // Active styles
                  '&.Mui-selected': {
                    backgroundColor: '#28A79F', // Teal background for active
                    color: '#ffffff', // White text for active
                    '& .MuiListItemIcon-root': {
                      color: '#ffffff', // White icon for active
                    },
                    '&:hover': { // Hover on active item
                        backgroundColor: '#239089', // Slightly darker teal
                    }
                  },
                  // Hover styles for non-active items
                  '&:hover': {
                    backgroundColor: 'rgba(40, 167, 159, 0.1)', // Light teal hover
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: isActive(item.path) ? '#ffffff' : '#28A79F', // Icon color: white if active, teal otherwise
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0, color: isActive(item.path) ? '#ffffff' : 'inherit' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </StyledDrawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100] // Light grey background like screenshots
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          pt: `${appBarHeight}px`, // Ensure content starts below app bar
        }}
      >
        {/* Add a Toolbar spacer only if not using theme.mixins.toolbar in DrawerHeader correctly */}
        {/* <Toolbar /> */}
        <Box sx={{ p: 3 }}> {/* Add padding to the main content area */}
             <Outlet /> {/* Renders the matched child route component */}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 