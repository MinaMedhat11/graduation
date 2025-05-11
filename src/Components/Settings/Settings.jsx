import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tab,
  Tabs,
  Grid,
  Card,
  CardContent,
  Switch,
  Button,
  FormControlLabel,
  TextField,
  Divider,
  Alert,
  IconButton,
  Snackbar
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Settings() {
  const { guard } = useAuth();
  const location = useLocation();
  const isAdmin = guard === 'admin' || location.pathname.includes('/admin');
  
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({
    emailNotifications: true,
    smsNotifications: false,
    browserNotifications: true,
    courseUpdates: true,
    newMessages: true,
    paymentReminders: true
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordVisible: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [generalSettings, setGeneralSettings] = useState({
    language: 'English',
    timezone: 'GMT+2 Cairo',
    darkMode: false,
    autoSave: true
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleTogglePassword = () => {
    setSecuritySettings({
      ...securitySettings,
      passwordVisible: !securitySettings.passwordVisible
    });
  };

  const handleNotificationChange = (event) => {
    setNotification({
      ...notification,
      [event.target.name]: event.target.checked
    });
  };

  const handleSecurityChange = (event) => {
    setSecuritySettings({
      ...securitySettings,
      [event.target.name]: event.target.checked
    });
  };

  const handleGeneralChange = (event) => {
    setGeneralSettings({
      ...generalSettings,
      [event.target.name]: event.target.checked
    });
  };

  const handleInputChange = (field) => (event) => {
    setSecuritySettings({
      ...securitySettings,
      [field]: event.target.value
    });
  };

  const handleSaveSettings = () => {
    // Here you would save the settings to your backend
    console.log('Saving settings:', { notification, securitySettings, generalSettings });
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Settings saved successfully!',
      severity: 'success'
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  const handleResetPassword = () => {
    // Validation
    if (!securitySettings.currentPassword) {
      setSnackbar({
        open: true,
        message: 'Please enter your current password',
        severity: 'error'
      });
      return;
    }
    
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'New passwords do not match',
        severity: 'error'
      });
      return;
    }
    
    if (securitySettings.newPassword.length < 8) {
      setSnackbar({
        open: true,
        message: 'Password must be at least 8 characters long',
        severity: 'error'
      });
      return;
    }
    
    // Here you would call API to change password
    console.log('Password reset requested');
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Password changed successfully!',
      severity: 'success'
    });
    
    // Reset form
    setSecuritySettings({
      ...securitySettings,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2, fontWeight: 'bold' }}>
        <SettingsIcon sx={{ mr: 1 }} /> Settings
      </Typography>

      <Paper sx={{ width: '100%', mb: 2, borderRadius: '12px', overflow: 'hidden' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="settings tabs"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root.Mui-selected': {
              color: '#28A79F',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#28A79F',
            }
          }}
        >
          <Tab icon={<SettingsIcon />} iconPosition="start" label="General" />
          <Tab icon={<NotificationsIcon />} iconPosition="start" label="Notifications" />
          <Tab icon={<SecurityIcon />} iconPosition="start" label="Security" />
        </Tabs>

        {/* General Settings */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ mb: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    General Settings
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        label="Language"
                        value={generalSettings.language}
                        onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                        SelectProps={{
                          native: true,
                        }}
                        fullWidth
                        variant="outlined"
                      >
                        <option value="English">English</option>
                        <option value="Arabic">Arabic</option>
                        <option value="French">French</option>
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        label="Time Zone"
                        value={generalSettings.timezone}
                        onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                        SelectProps={{
                          native: true,
                        }}
                        fullWidth
                        variant="outlined"
                      >
                        <option value="GMT+0 London">GMT+0 London</option>
                        <option value="GMT+1 Paris">GMT+1 Paris</option>
                        <option value="GMT+2 Cairo">GMT+2 Cairo</option>
                        <option value="GMT+3 Moscow">GMT+3 Moscow</option>
                        <option value="GMT-5 New York">GMT-5 New York</option>
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={generalSettings.darkMode}
                            onChange={handleGeneralChange}
                            name="darkMode"
                            color="primary"
                          />
                        }
                        label="Dark Mode"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={generalSettings.autoSave}
                            onChange={handleGeneralChange}
                            name="autoSave"
                            color="primary"
                          />
                        }
                        label="Auto Save"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              {/* User type specific settings */}
              {isAdmin ? (
                <Card sx={{ mb: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Admin Settings
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={true}
                              name="automaticBackups"
                              color="primary"
                            />
                          }
                          label="Enable Automatic Backups"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={false}
                              name="maintenanceMode"
                              color="primary"
                            />
                          }
                          label="Maintenance Mode"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ) : (
                <Card sx={{ mb: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Student Settings
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={true}
                              name="showCompletedCourses"
                              color="primary"
                            />
                          }
                          label="Show Completed Courses"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={true}
                              name="receiveCourseSuggestions"
                              color="primary"
                            />
                          }
                          label="Receive Course Suggestions"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notifications Settings */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ mb: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Notification Methods
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notification.emailNotifications}
                            onChange={handleNotificationChange}
                            name="emailNotifications"
                            color="primary"
                          />
                        }
                        label="Email Notifications"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notification.smsNotifications}
                            onChange={handleNotificationChange}
                            name="smsNotifications"
                            color="primary"
                          />
                        }
                        label="SMS Notifications"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notification.browserNotifications}
                            onChange={handleNotificationChange}
                            name="browserNotifications"
                            color="primary"
                          />
                        }
                        label="Browser Notifications"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Card sx={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Notification Types
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notification.courseUpdates}
                            onChange={handleNotificationChange}
                            name="courseUpdates"
                            color="primary"
                          />
                        }
                        label="Course Updates"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notification.newMessages}
                            onChange={handleNotificationChange}
                            name="newMessages"
                            color="primary"
                          />
                        }
                        label="New Messages"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notification.paymentReminders}
                            onChange={handleNotificationChange}
                            name="paymentReminders"
                            color="primary"
                          />
                        }
                        label="Payment Reminders"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Settings */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ mb: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Security
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={securitySettings.twoFactorAuth}
                            onChange={handleSecurityChange}
                            name="twoFactorAuth"
                            color="primary"
                          />
                        }
                        label="Two-Factor Authentication"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Card sx={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Change Password
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        label="Current Password"
                        type={securitySettings.passwordVisible ? "text" : "password"}
                        value={securitySettings.currentPassword}
                        onChange={handleInputChange('currentPassword')}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={handleTogglePassword}>
                              {securitySettings.passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="New Password"
                        type={securitySettings.passwordVisible ? "text" : "password"}
                        value={securitySettings.newPassword}
                        onChange={handleInputChange('newPassword')}
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Confirm New Password"
                        type={securitySettings.passwordVisible ? "text" : "password"}
                        value={securitySettings.confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<LockResetIcon />}
                        onClick={handleResetPassword}
                        sx={{ 
                          backgroundColor: '#28A79F',
                          '&:hover': {
                            backgroundColor: '#1C7A73',
                          }
                        }}
                      >
                        Change Password
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleSaveSettings}
          sx={{ 
            backgroundColor: '#28A79F',
            '&:hover': {
              backgroundColor: '#1C7A73',
            }
          }}
        >
          Save Settings
        </Button>
      </Box>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
