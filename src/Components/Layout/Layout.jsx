import React, { useState } from 'react';
import { useNavigate, Outlet, NavLink, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
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
// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
// Images
import logoPlaceholder from '../../Images/Logo.png';
import ChatBot from 'Components/ChatBot/ChatBot';

// Styled Components
const drawerWidth = 240;
const appBarHeight = 64;

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
  backgroundColor: '#ffffff',
  color: theme.palette.text.primary,
  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.05)',
}));

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    borderRight: 'none',
    backgroundColor: '#E0F2F1',
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
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 1),
  height: appBarHeight,
  ...theme.mixins.toolbar,
}));

const Layout = () => {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // State
  const [open, setOpen] = useState(true);
  const [anchorElUser, setAnchorElUser] = useState(null);

  // Handlers
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    handleCloseUserMenu();
  };

  // Sidebar Configuration
  const sidebarItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Courses', icon: <SchoolIcon />, path: '/courses' },
    { text: 'Assignment', icon: <AssignmentIcon />, path: '/assignments' },
    { text: 'Payments', icon: <PaymentIcon />, path: '/payments' },
    { text: 'Lectures', icon: <OndemandVideoIcon />, path: '/lectures' },
    { text: 'Chat', icon: <ChatOutlinedIcon />, path: '/chat' },

  ];

  const isActive = (path) => {
    return location.pathname === path ||
      (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/*ChatBot */}
      <ChatBot />


      {/* Top App Bar */}
      <StyledAppBar position="fixed" open={open}>
        <Toolbar sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: appBarHeight
        }}>
          <Box sx={{ width: open ? 0 : 60 }}></Box>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexGrow: 1,
            justifyContent: 'flex-end'
          }}>
            {/* Search Bar */}
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
                  borderRadius: '30px',
                  backgroundColor: '#F8F9FA',
                  width: '350px',
                  '& fieldset': { border: 'none' },
                }
              }}
              sx={{ display: { xs: 'none', sm: 'block' } }}
            />

            {/* Notifications */}
            <IconButton color="inherit" aria-label="notifications">
              <NotificationsNoneOutlinedIcon />
            </IconButton>

            {/* User Menu */}
            <Box sx={{ flexGrow: 0 }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
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

                <MenuItem component={NavLink} to="/settings" onClick={handleCloseUserMenu}>
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
          <img
            src={logoPlaceholder}
            alt="Education Your Tagline"
            style={{ height: '40px', objectFit: 'contain' }}
          />
        </DrawerHeader>

        <List sx={{ pt: 2 }}>
          {sidebarItems.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ display: 'block', px: 1.5 }}
            >
              <ListItemButton
                component={NavLink}
                to={item.path}
                selected={isActive(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  mb: 1,
                  borderRadius: '8px',

                  '&.Mui-selected': {
                    backgroundColor: '#28A79F',
                    color: '#ffffff',
                    '& .MuiListItemIcon-root': {
                      color: '#ffffff',
                    },
                    '&:hover': {
                      backgroundColor: '#239089',
                    }
                  },

                  '&:hover': {
                    backgroundColor: 'rgba(40, 167, 159, 0.1)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: isActive(item.path) ? '#ffffff' : '#28A79F',
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    color: isActive(item.path) ? '#ffffff' : 'inherit'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </StyledDrawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          pt: `${appBarHeight}px`,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;