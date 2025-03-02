import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './Profile.module.css';

export default function Profile() {
  // User data
  const [userData, setUserData] = useState({
    name: 'Adam Rawles',
    email: 'alexarawles@gmail.com',
    phone: '01010111049844',
    birthdate: '26/7/2000',
    password: '********************'
  });

  // State for form data (for editing)
  const [formData, setFormData] = useState({...userData});
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({...formData});
    // Here you would typically send the data to your backend
    alert('Profile updated successfully!');
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
                  <label className={styles.formLabel}>
                    Name *
                  </label>
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
                  <label className={styles.formLabel}>
                    Phone Number *
                  </label>
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
                  <label className={styles.formLabel}>
                    Email *
                  </label>
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
                  <label className={styles.formLabel}>
                    Birthdate *
                  </label>
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
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Change password
                  </label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.iconWrapper}>
                      <i className="fa-solid fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="********************"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}></div>
              </div>
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 