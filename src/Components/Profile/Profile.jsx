import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './Profile.module.css';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const location = useLocation();
  const { guard } = useAuth();
  const isAdmin = guard === 'admin' || location.pathname.includes('/admin');
  
  // User data
  const [userData, setUserData] = useState({
    name: 'Adam Rawles',
    email: 'alexarawles@gmail.com',
    phone: '01010111049844',
    birthdate: '26/7/2000',
    password: '**************',
    title: '',
    biography: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    whatsapp: '',
    youtube: '',
    website: '',
    notifyCourseBuy: false,
    notifyCourseReview: false,
    notifyLectureComment: false,
    notifyLectureDownload: false,
    notifyCommentReply: false,
    notifyProfileViews: false,
    notifyFileDownload: false,
  });

  // Form and UI state
  const [formData, setFormData] = useState({ ...userData });
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    // جلب بيانات المستخدم من الـ API عند تحميل المكون
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token is missing or expired');
          return;
        }
        const response = await fetch('http://127.0.0.1:8000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok) {
          setUserData(result.user);
          setFormData(result.user); // تحديث formData بالبيانات المسترجعة
        } else {
          setError(result.message || 'Error fetching data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching data');
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token is missing or expired');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.birthdate,
          bio: formData.biography,
          social_links: {
            facebook: formData.facebook,
            instagram: formData.instagram,
            linkedin: formData.linkedin,
            twitter: formData.twitter,
            whatsapp: formData.whatsapp,
            youtube: formData.youtube,
            website: formData.website,
          },
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setUserData(result.user);
        alert('Profile updated successfully!');
      } else {
        setError(result.message || 'Error updating profile');
      }
      // عرض النتيجة في الـ console
      console.log('API Response:', result);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile');
    }
  };
  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password form
    const newErrors = {};
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.confirmPassword !== passwordForm.newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }

    // Send API request to change password
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setPasswordErrors({ general: 'Token is missing or expired' });
        return;
      }
      
      const response = await fetch('http://127.0.0.1:8000/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword,
          new_password_confirmation: passwordForm.confirmPassword,
        }),
      });
      
      const result = await response.json();
      if (response.ok) {
        alert('Password changed successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setPasswordErrors({ general: result.message || 'Error changing password' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordErrors({ general: 'Error changing password' });
    }
  };

  // Handle notification toggle
  const handleNotificationToggle = (notificationType) => {
    setFormData(prev => ({
      ...prev,
      [notificationType]: !prev[notificationType]
    }));
  };
  
  return (
    <div className={styles.profileContainer}>
      {!isAdmin && (
        <div className={styles.sidebarWrapper}>
          <Sidebar />
        </div>
      )}
      <div className={isAdmin ? styles.mainContentFull : styles.mainContent}>
        {!isAdmin && <Header />}
        <div className={styles.profileContent}>
          {/* Edit Profile Header */}
          <div className={styles.editProfileHeader}>
            <div className={styles.editIcon}>
              <i className="fa-solid fa-pen"></i>
            </div>
            <h2 className={styles.editTitle}>Edit profile</h2>
          </div>

          {/* Profile Tabs */}
          <div className={styles.profileTabs}>
            <div 
              className={`${styles.profileTab} ${activeTab === 'profile' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </div>
            <div 
              className={`${styles.profileTab} ${activeTab === 'password' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('password')}
            >
              Password
            </div>
            <div 
              className={`${styles.profileTab} ${activeTab === 'notifications' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </div>
            <div 
              className={`${styles.profileTab} ${activeTab === 'social' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('social')}
            >
              Social Profiles
            </div>
          </div>          {/* Profile Card */}
          <div className={styles.profileCard}>
            {/* User Info Header */}
            <div className={styles.userInfoHeader}>
              <div className={styles.userAvatar}>
                <img
                  src="/images/profile.jpg"
                  alt="User Profile"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://ui-avatars.com/api/?name=Adam+Rawles&background=3CB0A5&color=fff';
                  }}
                />
              </div>
              <div className={styles.userDetails}>
                <h3 className={styles.userName}>{userData.name}</h3>
                <p className={styles.userEmail}>{userData.email}</p>
              </div>
            </div>

            {/* Profile Form - conditionally rendered based on active tab */}
            {activeTab === 'profile' && (
              <form className={styles.profileForm} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Name *</label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.iconWrapper}>
                      <i className="fa-regular fa-user"></i>
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Adam Raw"
                      required
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone Number *</label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.iconWrapper}>
                      <i className="fa-solid fa-phone"></i>
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="01010111049844"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email *</label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.iconWrapper}>
                      <i className="fa-regular fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="alexarawles@gmail.com"
                      required
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Birthdate</label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.iconWrapper}>
                      <i className="fa-regular fa-calendar"></i>
                    </span>
                    <input
                      type="text"
                      name="birthdate"
                      value={formData.birthdate}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="26/7/2000"
                    />
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Biography</label>
                <div className={styles.inputWithIcon}>
                  <span className={styles.iconWrapper}>
                    <i className="fa-regular fa-pencil"></i>
                  </span>
                  <textarea
                    name="biography"
                    value={formData.biography}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Short biography about yourself"
                  />
                </div>
              </div>

              {/* Social Media Links */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Facebook</label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.iconWrapper}>
                      <i className="fa-brands fa-facebook"></i>
                    </span>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="facebook.com/yourprofile"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Instagram</label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.iconWrapper}>
                      <i className="fa-brands fa-instagram"></i>
                    </span>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="instagram.com/yourprofile"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>LinkedIn</label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.iconWrapper}>
                      <i className="fa-brands fa-linkedin"></i>
                    </span>
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="linkedin.com/yourprofile"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Twitter</label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.iconWrapper}>
                      <i className="fa-brands fa-twitter"></i>
                    </span>
                    <input
                      type="text"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="twitter.com/yourprofile"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Whatsapp</label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.iconWrapper}>
                      <i className="fa-brands fa-whatsapp"></i>
                    </span>
                    <input
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="whatsapp.com/yourprofile"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>YouTube</label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.iconWrapper}>
                      <i className="fa-brands fa-youtube"></i>
                    </span>
                    <input
                      type="text"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="youtube.com/yourprofile"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Website</label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.iconWrapper}>
                      <i className="fa-solid fa-globe"></i>
                    </span>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="yourwebsite.com"
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className={styles.saveButton}>
                Update Profile
              </button>
            </form>
            )}

            {/* Password Change Tab */}
            {activeTab === 'password' && (
              <form className={styles.profileForm} onSubmit={handlePasswordSubmit}>
                <h4 className={styles.sectionTitle}>Change Password</h4>
                
                {passwordErrors.general && (
                  <div className={styles.errorMessage}>{passwordErrors.general}</div>
                )}
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Current Password *</label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.iconWrapper}>
                      <i className="fa-solid fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className={styles.formInput}
                      placeholder="••••••••••••"
                    />
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className={styles.errorText}>{passwordErrors.currentPassword}</p>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>New Password *</label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.iconWrapper}>
                      <i className="fa-solid fa-key"></i>
                    </span>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className={styles.formInput}
                      placeholder="New Password"
                    />
                  </div>
                  {passwordErrors.newPassword && (
                    <p className={styles.errorText}>{passwordErrors.newPassword}</p>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Confirm New Password *</label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.iconWrapper}>
                      <i className="fa-solid fa-key"></i>
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className={styles.formInput}
                      placeholder="Confirm New Password"
                    />
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className={styles.errorText}>{passwordErrors.confirmPassword}</p>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <div className={styles.passwordRequirements}>
                    <h5 className={styles.requirementsTitle}>Password Requirements:</h5>
                    <ul className={styles.requirementsList}>
                      <li className={styles.requirementItem}>At least 8 characters long</li>
                      <li className={styles.requirementItem}>Include at least one uppercase letter</li>
                      <li className={styles.requirementItem}>Include at least one number</li>
                      <li className={styles.requirementItem}>Include at least one special character</li>
                    </ul>
                  </div>
                </div>
                
                <button type="submit" className={styles.saveButton}>
                  Change Password
                </button>
              </form>
            )}
            
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className={styles.profileForm}>
                <h4 className={styles.sectionTitle}>Notification Settings</h4>
                <p className={styles.sectionDescription}>Manage your notification preferences</p>
                
                <div className={styles.notificationSettings}>
                  <div className={styles.notificationSection}>
                    <h5 className={styles.notificationCategory}>Course Notifications</h5>
                    
                    <div className={styles.notificationItem}>
                      <div className={styles.notificationInfo}>
                        <h6 className={styles.notificationTitle}>Course Purchase</h6>
                        <p className={styles.notificationDescription}>Get notified when you purchase a course</p>
                      </div>
                      <label className={styles.toggle}>
                        <input 
                          type="checkbox" 
                          checked={formData.notifyCourseBuy} 
                          onChange={() => handleNotificationToggle('notifyCourseBuy')}
                          className={styles.toggleInput}
                        />
                        <span className={styles.toggleSlider}></span>
                      </label>
                    </div>
                    
                    <div className={styles.notificationItem}>
                      <div className={styles.notificationInfo}>
                        <h6 className={styles.notificationTitle}>Course Review</h6>
                        <p className={styles.notificationDescription}>Get notified when someone comments on your course</p>
                      </div>
                      <label className={styles.toggle}>
                        <input 
                          type="checkbox" 
                          checked={formData.notifyCourseReview} 
                          onChange={() => handleNotificationToggle('notifyCourseReview')}
                          className={styles.toggleInput} 
                        />
                        <span className={styles.toggleSlider}></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className={styles.notificationSection}>
                    <h5 className={styles.notificationCategory}>Lecture Notifications</h5>
                    
                    <div className={styles.notificationItem}>
                      <div className={styles.notificationInfo}>
                        <h6 className={styles.notificationTitle}>Lecture Comments</h6>
                        <p className={styles.notificationDescription}>Get notified when someone comments on your lecture</p>
                      </div>
                      <label className={styles.toggle}>
                        <input 
                          type="checkbox" 
                          checked={formData.notifyLectureComment} 
                          onChange={() => handleNotificationToggle('notifyLectureComment')}
                          className={styles.toggleInput} 
                        />
                        <span className={styles.toggleSlider}></span>
                      </label>
                    </div>
                    
                    <div className={styles.notificationItem}>
                      <div className={styles.notificationInfo}>
                        <h6 className={styles.notificationTitle}>Lecture Downloads</h6>
                        <p className={styles.notificationDescription}>Get notified when someone downloads your lecture</p>
                      </div>
                      <label className={styles.toggle}>
                        <input 
                          type="checkbox" 
                          checked={formData.notifyLectureDownload} 
                          onChange={() => handleNotificationToggle('notifyLectureDownload')}
                          className={styles.toggleInput} 
                        />
                        <span className={styles.toggleSlider}></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className={styles.notificationSection}>
                    <h5 className={styles.notificationCategory}>Other Notifications</h5>
                    
                    <div className={styles.notificationItem}>
                      <div className={styles.notificationInfo}>
                        <h6 className={styles.notificationTitle}>Comment Replies</h6>
                        <p className={styles.notificationDescription}>Get notified when someone replies to your comments</p>
                      </div>
                      <label className={styles.toggle}>
                        <input 
                          type="checkbox" 
                          checked={formData.notifyCommentReply} 
                          onChange={() => handleNotificationToggle('notifyCommentReply')}
                          className={styles.toggleInput} 
                        />
                        <span className={styles.toggleSlider}></span>
                      </label>
                    </div>
                    
                    <div className={styles.notificationItem}>
                      <div className={styles.notificationInfo}>
                        <h6 className={styles.notificationTitle}>Profile Views</h6>
                        <p className={styles.notificationDescription}>Get notified when someone views your profile</p>
                      </div>
                      <label className={styles.toggle}>
                        <input 
                          type="checkbox" 
                          checked={formData.notifyProfileViews} 
                          onChange={() => handleNotificationToggle('notifyProfileViews')}
                          className={styles.toggleInput} 
                        />
                        <span className={styles.toggleSlider}></span>
                      </label>
                    </div>
                    
                    <div className={styles.notificationItem}>
                      <div className={styles.notificationInfo}>
                        <h6 className={styles.notificationTitle}>File Downloads</h6>
                        <p className={styles.notificationDescription}>Get notified when your files are downloaded</p>
                      </div>
                      <label className={styles.toggle}>
                        <input 
                          type="checkbox" 
                          checked={formData.notifyFileDownload} 
                          onChange={() => handleNotificationToggle('notifyFileDownload')}
                          className={styles.toggleInput} 
                        />
                        <span className={styles.toggleSlider}></span>
                      </label>
                    </div>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={handleSubmit}
                    className={styles.savePreferencesButton}
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
            
            {/* Social Profile Tab */}
            {activeTab === 'social' && (
              <form className={styles.profileForm} onSubmit={handleSubmit}>
                <h4 className={styles.sectionTitle}>Social Profiles</h4>
                <p className={styles.sectionDescription}>Connect your social media accounts</p>
                
                <div className={styles.socialProfilesSection}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Facebook</label>
                      <div className={styles.inputWithIcon}>
                        <span className={styles.iconWrapper}>
                          <i className="fa-brands fa-facebook"></i>
                        </span>
                        <input
                          type="text"
                          name="facebook"
                          value={formData.facebook}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          placeholder="facebook.com/yourprofile"
                        />
                      </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Instagram</label>
                      <div className={styles.inputWithIcon}>
                        <span className={styles.iconWrapper}>
                          <i className="fa-brands fa-instagram"></i>
                        </span>
                        <input
                          type="text"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          placeholder="instagram.com/yourprofile"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Twitter</label>
                      <div className={styles.inputWithIcon}>
                        <span className={styles.iconWrapper}>
                          <i className="fa-brands fa-twitter"></i>
                        </span>
                        <input
                          type="text"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          placeholder="twitter.com/yourprofile"
                        />
                      </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>LinkedIn</label>
                      <div className={styles.inputWithIcon}>
                        <span className={styles.iconWrapper}>
                          <i className="fa-brands fa-linkedin"></i>
                        </span>
                        <input
                          type="text"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          placeholder="linkedin.com/in/yourprofile"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>WhatsApp</label>
                      <div className={styles.inputWithIcon}>
                        <span className={styles.iconWrapper}>
                          <i className="fa-brands fa-whatsapp"></i>
                        </span>
                        <input
                          type="text"
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          placeholder="+1234567890"
                        />
                      </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>YouTube</label>
                      <div className={styles.inputWithIcon}>
                        <span className={styles.iconWrapper}>
                          <i className="fa-brands fa-youtube"></i>
                        </span>
                        <input
                          type="text"
                          name="youtube"
                          value={formData.youtube}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          placeholder="youtube.com/c/yourchannel"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Website</label>
                      <div className={styles.inputWithIcon}>
                        <span className={styles.iconWrapper}>
                          <i className="fa-solid fa-globe"></i>
                        </span>
                        <input
                          type="text"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          placeholder="yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button type="submit" className={styles.saveButton}>
                    Save Social Profiles
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
