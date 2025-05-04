import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './Profile.module.css';

export default function Profile() {
  // بيانات المستخدم الحالية
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

  // حالة البيانات لتعديلها
  const [formData, setFormData] = useState({ ...userData });
  const [error, setError] = useState('');

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

  return (
    <div className={styles.profileContainer}>
      <div className={styles.sidebarWrapper}>
        <Sidebar />
      </div>
      <div className={styles.mainContent}>
        <Header />
        <div className={styles.profileContent}>
          {/* Edit Profile Header */}
          <div className={styles.editProfileHeader}>
            <div className={styles.editIcon}>
              <i className="fa-solid fa-pen"></i>
            </div>
            <h2 className={styles.editTitle}>Edit profile</h2>
          </div>

          {/* Profile Card */}
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

            {/* Profile Form */}
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
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
