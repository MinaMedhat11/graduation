import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkIcon from '@mui/icons-material/Link';
import SaveIcon from '@mui/icons-material/Save';

// Mock Initial Data
const initialUserData = {
    name: 'Adam Rawles',
    email: 'alexarawles@gmail.com',
    phone: '01010111049844',
    birthdate: '26/7/2000',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    title: 'Your tittle, proffesion or small biography', // Placeholder from image
    biography: 'Your tittle, proffesion or small biography', // Placeholder from image
    website: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    whatsapp: '',
    youtube: '',
    notifyCourseBuy: true,
    notifyCourseReview: true,
    notifyLectureComment: true,
    notifyCommentReply: false,
    notifyProfileViews: true,
    notifyLectureDownload: true,
    notifyFileDownload: true,
    avatar: '/static/images/avatar/1.jpg' // Placeholder avatar
};

export default function Profile() {
    const [formData, setFormData] = useState(initialUserData);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Add useEffect here to fetch actual user data and setFormData if needed
    // useEffect(() => { fetchUserData().then(data => setFormData(data)) }, [])

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Saving profile data:', formData);
        // Add API call logic here to update profile
    };

    const togglePasswordVisibility = (field) => {
        switch (field) {
            case 'current': setShowCurrentPassword(!showCurrentPassword); break;
            case 'new': setShowNewPassword(!showNewPassword); break;
            case 'confirm': setShowConfirmPassword(!showConfirmPassword); break;
            default: break;
    }
  };

  return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 900, margin: 'auto' }}>
             <Typography variant="h5" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2, fontWeight: 'bold' }}>
                 <EditIcon sx={{ mr: 1 }} /> Edit profile
             </Typography>

            <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
                 {/* User Header */}
                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                     <Avatar alt={formData.name} src={formData.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
                     <Box>
                         <Typography variant="h6">{formData.name}</Typography>
                         <Typography variant="body2" color="text.secondary">{formData.email}</Typography>
                     </Box>
                 </Box>

                 <Grid container spacing={3}>
                     {/* Basic Info */}
                     <Grid item xs={12} md={6}>
                         <TextField
                            required
                            fullWidth
                            label="Name"
                      name="name"
                      value={formData.name}
                            onChange={handleChange}
                            size="small"
                            InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon /></InputAdornment> }}
                         />
                     </Grid>
                     <Grid item xs={12} md={6}>
                         <TextField
                      required
                             fullWidth
                             label="Phone Number"
                      name="phone"
                      value={formData.phone}
                             onChange={handleChange}
                             size="small"
                             InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon /></InputAdornment> }}
                          />
                     </Grid>
                     <Grid item xs={12} md={6}>
                         <TextField
                      required
                             fullWidth
                             label="Email"
                             name="email"
                      type="email"
                      value={formData.email}
                             onChange={handleChange}
                             size="small"
                             InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon /></InputAdornment> }}
                          />
                     </Grid>
                     <Grid item xs={12} md={6}>
                         <TextField
                             fullWidth
                             label="Birthdate"
                      name="birthdate"
                      value={formData.birthdate}
                             onChange={handleChange}
                             size="small"
                             placeholder="DD/MM/YYYY"
                             InputProps={{ startAdornment: <InputAdornment position="start"><CakeOutlinedIcon /></InputAdornment> }}
                          />
                     </Grid>

                     {/* Change Password Placeholder - In image this is separate */}
                     {/* <Grid item xs={12}>
                         <TextField disabled fullWidth label="Change password" defaultValue="**************" size="small" />
                     </Grid> */}

                     {/* Title & Biography */}
                     <Grid item xs={12}>
                         <TextField
                             fullWidth
                             label="Title"
                             name="title"
                             value={formData.title}
                             onChange={handleChange}
                             size="small"
                             placeholder="Your title, profession or small biography"
                          />
                     </Grid>
                      <Grid item xs={12}>
                         <TextField
                             fullWidth
                             multiline
                             rows={3}
                             label="Biography"
                    name="biography"
                    value={formData.biography}
                             onChange={handleChange}
                             size="small"
                             placeholder="Your title, profession or small biography"
                          />
                     </Grid>

                    <Grid item xs={12}><Divider sx={{ my: 1 }}><Typography variant="overline">Social Profile</Typography></Divider></Grid>

                     {/* Social Profile */}
                     <Grid item xs={12}>
                         <TextField
                             fullWidth
                             label="Personal website or portfolio url..."
                      name="website"
                      value={formData.website}
                             onChange={handleChange}
                             size="small"
                             InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon /></InputAdornment> }}
                         />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}>
                         <TextField fullWidth label="Facebook Username" name="facebook" value={formData.facebook} onChange={handleChange} size="small" InputProps={{ startAdornment: <InputAdornment position="start"><FacebookIcon /></InputAdornment> }}/>
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}>
                         <TextField fullWidth label="Instagram Username" name="instagram" value={formData.instagram} onChange={handleChange} size="small" InputProps={{ startAdornment: <InputAdornment position="start"><InstagramIcon /></InputAdornment> }}/>
                     </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                         <TextField fullWidth label="LinkedIn Username" name="linkedin" value={formData.linkedin} onChange={handleChange} size="small" InputProps={{ startAdornment: <InputAdornment position="start"><LinkedInIcon /></InputAdornment> }}/>
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}>
                         <TextField fullWidth label="Twitter Username" name="twitter" value={formData.twitter} onChange={handleChange} size="small" InputProps={{ startAdornment: <InputAdornment position="start"><TwitterIcon /></InputAdornment> }}/>
                     </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                         <TextField fullWidth label="Whatsapp Phone Number" name="whatsapp" value={formData.whatsapp} onChange={handleChange} size="small" InputProps={{ startAdornment: <InputAdornment position="start"><WhatsAppIcon /></InputAdornment> }}/>
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}>
                         <TextField fullWidth label="Youtube Username" name="youtube" value={formData.youtube} onChange={handleChange} size="small" InputProps={{ startAdornment: <InputAdornment position="start"><YouTubeIcon /></InputAdornment> }}/>
                     </Grid>

                    <Grid item xs={12}><Divider sx={{ my: 1 }}><Typography variant="overline">Notifications</Typography></Divider></Grid>

                    {/* Notifications & Change Password Side-by-Side */}
                    <Grid item container xs={12} spacing={3}>
                        {/* Notifications Column */}
                        <Grid item xs={12} md={6}>
                             <Typography variant="subtitle1" gutterBottom>Notifications</Typography>
                             <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                 <FormControlLabel control={<Checkbox checked={formData.notifyCourseBuy} onChange={handleChange} name="notifyCourseBuy" size="small" />} label="I want to know when buy my course." />
                                 <FormControlLabel control={<Checkbox checked={formData.notifyCourseReview} onChange={handleChange} name="notifyCourseReview" size="small" />} label="I want to know who write a review on my course." />
                                 <FormControlLabel control={<Checkbox checked={formData.notifyLectureComment} onChange={handleChange} name="notifyLectureComment" size="small" />} label="I want to know who commented on my lecture." />
                                 <FormControlLabel control={<Checkbox checked={formData.notifyCommentReply} onChange={handleChange} name="notifyCommentReply" size="small" />} label="I want to know who reply on my comment" />
                                 <FormControlLabel control={<Checkbox checked={formData.notifyProfileViews} onChange={handleChange} name="notifyProfileViews" size="small" />} label="I want to know daily how many people visited my profile." />
                                 <FormControlLabel control={<Checkbox checked={formData.notifyLectureDownload} onChange={handleChange} name="notifyLectureDownload" size="small" />} label="I want to know who download my lecture attach file." />
                                  <FormControlLabel control={<Checkbox checked={formData.notifyFileDownload} onChange={handleChange} name="notifyFileDownload" size="small" />} label="I want to know who download my lecture notes." />
                            </Box>
                        </Grid>

                        {/* Change Password Column */}
                         <Grid item xs={12} md={6}>
                             <Typography variant="subtitle1" gutterBottom>Change password</Typography>
                             <TextField
                                fullWidth
                                type={showCurrentPassword ? 'text' : 'password'}
                                label="Current Password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                size="small"
                                sx={{ mb: 2 }}
                                InputProps={{
                                     startAdornment: <InputAdornment position="start"><LockOutlinedIcon /></InputAdornment>,
                                     endAdornment: <InputAdornment position="end">
                                         <IconButton aria-label="toggle password visibility" onClick={() => togglePasswordVisibility('current')} edge="end">
                                             {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                         </IconButton>
                                     </InputAdornment>
                                }}
                              />
                             <TextField
                                fullWidth
                                type={showNewPassword ? 'text' : 'password'}
                                label="New Password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                size="small"
                                sx={{ mb: 2 }}
                                InputProps={{
                                     startAdornment: <InputAdornment position="start"><LockOutlinedIcon /></InputAdornment>,
                                     endAdornment: <InputAdornment position="end">
                                          <IconButton aria-label="toggle password visibility" onClick={() => togglePasswordVisibility('new')} edge="end">
                                             {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                         </IconButton>
                                     </InputAdornment>
                                }}
                              />
                             <TextField
                                fullWidth
                                type={showConfirmPassword ? 'text' : 'password'}
                                label="Confirm New Password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                size="small"
                                InputProps={{
                                     startAdornment: <InputAdornment position="start"><LockOutlinedIcon /></InputAdornment>,
                                     endAdornment: <InputAdornment position="end">
                                          <IconButton aria-label="toggle password visibility" onClick={() => togglePasswordVisibility('confirm')} edge="end">
                                             {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                         </IconButton>
                                     </InputAdornment>
                                }}
                              />
                         </Grid>
                     </Grid>
                 </Grid>

                 <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                     <Button type="submit" variant="contained" startIcon={<SaveIcon />} sx={{ backgroundColor: '#25cf9d', '&:hover': { backgroundColor: '#1da884' }, borderRadius: '8px' }}>
                         Save
                     </Button>
                 </Box>
             </Paper>
         </Box>
  );
}
