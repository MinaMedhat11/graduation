import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import PhoneIcon from '@mui/icons-material/Phone';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress'; // لاستخدامه أثناء تحميل التخصصات

// افترض أن لديك axios instance مهيأ في مكان ما، أو يمكنك استخدام fetch مباشرة
// import api from './api'; // أو أي مسار لملف axios instance
// إذا لم يكن لديك axios instance، يمكنك استخدام fetch كما في المثال

export default function AddInstructorModal({ open, onClose, onAddUser }) {
  const initialFormData = {
    name: '',
    email: '',
    password: '',
    confirmPass: '', // سيتم ربطه بـ password_confirmation
    bio: '',
    phone: '',
    major_id: '',    // حقل جديد للـ instructor، سيكون ID من القائمة المنسدلة
    salary: '',
    // status و role ثابتان ولا يحتاجان لحقول في النموذج
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [majors, setMajors] = useState([]);
  const [loadingMajors, setLoadingMajors] = useState(false);

  // جلب التخصصات عند فتح النافذة
  useEffect(() => {
    if (open) {
      // إعادة تعيين النموذج
      setFormData(initialFormData);
      setErrors({});
      
      const fetchMajors = async () => {
        setLoadingMajors(true);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://127.0.0.1:8000/api/major/index', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch majors');
          }
          const data = await response.json();
          if (data.major && data.major.data) {
            setMajors(data.major.data);
          } else {
            setMajors([]);
          }
        } catch (error) {
          console.error("Error fetching majors:", error);
          setErrors(prev => ({ ...prev, form: 'Could not load majors. Please try again.' }));
          setMajors([]);
        } finally {
          setLoadingMajors(false);
        }
      };
      fetchMajors();
    }
  }, [open]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (errors.form) {
        setErrors(prev => ({ ...prev, form: null}));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) { // API قد يكون له متطلبات أخرى لطول كلمة المرور
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPass) {
      newErrors.confirmPass = 'Passwords do not match';
    }
    if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone)) { // تحقق أساسي من رقم الهاتف
        newErrors.phone = 'Invalid phone number format (e.g., 01012345678)';
    }
    if (!formData.major_id) { // major_id سيكون الـ ID المختار
      newErrors.major_id = 'Major is required';
    }
    if (!formData.salary.trim()) {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(formData.salary) || parseFloat(formData.salary) < 0) {
        newErrors.salary = 'Salary must be a non-negative number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
            setErrors(prev => ({...prev, form: 'Authentication token not found. Please log in.'}));
            return;
        }
        
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        };
        
        const instructorPayload = {
          name: formData.name,
          email: formData.email,
          role: "instructor", // قيمة ثابتة
          password: formData.password,
          password_confirmation: formData.confirmPass,
          bio: formData.bio,
          phone: formData.phone,
          major_id: parseInt(formData.major_id, 10), // الـ ID من القائمة المنسدلة
          status: "1", // قيمة ثابتة
          salary: parseFloat(formData.salary),
        };
        
        const response = await fetch(`http://127.0.0.1:8000/api/instructor/create`, {
          method: 'POST',
          headers,
          body: JSON.stringify(instructorPayload),
        });
        
        const responseData = await response.json();

        if (!response.ok) {
            // معالجة أخطاء الـ API (مثل أخطاء التحقق من الصحة من Laravel)
            let errorMessage = responseData.message || `Failed to add instructor (HTTP ${response.status})`;
            if (responseData.errors) {
                const fieldErrors = {};
                for (const key in responseData.errors) {
                    // ربط أخطاء الـ API بأسماء الحقول في النموذج إذا أمكن
                    const formKey = key === 'password_confirmation' ? 'confirmPass' : key;
                    fieldErrors[formKey] = responseData.errors[key][0];
                }
                setErrors(prev => ({...prev, ...fieldErrors, form: errorMessage.split(' (HTTP')[0]}));
            } else {
                setErrors(prev => ({...prev, form: errorMessage}));
            }
            return;
        }
        
        // بناء كائن المستخدم الجديد لإرساله إلى onAddUser
        // يفضل استخدام البيانات الفعلية من استجابة الـ API إذا كانت متوفرة
        const createdInstructorData = responseData.data || {}; 

        const newUserForParent = {
          id: createdInstructorData.id || `instructor-${Date.now()}`,
          name: createdInstructorData.name || formData.name,
          email: createdInstructorData.email || formData.email,
          role: 'Instructor', // للعرض في الواجهة
          status: createdInstructorData.status === 1 ? 'Active' : (createdInstructorData.status === 0 ? 'Inactive' : 'Unknown'),
          dateJoined: createdInstructorData.created_at ? new Date(createdInstructorData.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff`,
          // إضافة أي بيانات أخرى ذات صلة من createdInstructorData
          bio: createdInstructorData.bio || formData.bio,
          phone: createdInstructorData.phone || formData.phone,
          major_id: createdInstructorData.major_id || formData.major_id,
          salary: createdInstructorData.salary || formData.salary,
        };
        
        onAddUser(newUserForParent);
        onClose(); // إغلاق النافذة عند النجاح

      } catch (err) { // أخطاء الشبكة أو أخطاء JavaScript
        console.error('Add instructor error:', err);
        setErrors(prev => ({...prev, form: err.message || 'An unexpected error occurred. Please try again.'}));
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Instructor</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Name */}
          <Grid item xs={12}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Full Name"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          {/* Email */}
          <Grid item xs={12}>
            <TextField
              required
              margin="dense"
              id="email"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          {/* Password */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              margin="dense"
              id="password"
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>
          {/* Confirm Password */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              margin="dense"
              id="confirmPass"
              name="confirmPass"
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              value={formData.confirmPass}
              onChange={handleInputChange}
              error={!!errors.confirmPass}
              helperText={errors.confirmPass}
            />
          </Grid>
          {/* Bio */}
          <Grid item xs={12}>
            <TextField
              margin="dense"
              id="bio"
              name="bio"
              label="Bio"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              minRows={2}
              value={formData.bio}
              onChange={handleInputChange}
              error={!!errors.bio}
              helperText={errors.bio}
            />
          </Grid>
          {/* Phone */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              margin="dense"
              id="phone"
              name="phone"
              label="Phone Number"
              type="tel" // نوع مناسب للهاتف
              fullWidth
              variant="outlined"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {/* Major Dropdown */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense" required error={!!errors.major_id}>
              <InputLabel id="major-select-label">Major</InputLabel>
              <Select
                labelId="major-select-label"
                id="major_id"
                name="major_id"
                value={formData.major_id}
                label="Major"
                onChange={handleInputChange}
                disabled={loadingMajors}
              >
                {loadingMajors && (
                  <MenuItem value="" disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} /> Loading Majors...
                  </MenuItem>
                )}
                {!loadingMajors && majors.length === 0 && (
                  <MenuItem value="" disabled>No majors available</MenuItem>
                )}
                {!loadingMajors && majors.map((major) => (
                  <MenuItem key={major.id} value={major.id}>
                    {major.title}
                  </MenuItem>
                ))}
              </Select>
              {errors.major_id && <FormHelperText>{errors.major_id}</FormHelperText>}
            </FormControl>
          </Grid>
          {/* Salary */}
          <Grid item xs={12}>
            <TextField
              required
              margin="dense"
              id="salary"
              name="salary"
              label="Salary"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.salary}
              onChange={handleInputChange}
              error={!!errors.salary}
              helperText={errors.salary}
              InputProps={{
                startAdornment: <InputAdornment position="start">EGP</InputAdornment>, // إذا كانت العملة ثابتة
              }}
            />
          </Grid>
          {/* status و role قيم ثابتة ولا تحتاج لحقول ظاهرة */}
        </Grid>
        {errors.form && (
          <FormHelperText error sx={{ mt: 2, textAlign: 'center', fontSize: '0.9rem' }}>
            {errors.form}
          </FormHelperText>
        )}
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Instructor
        </Button>
      </DialogActions>
    </Dialog>
  );
}