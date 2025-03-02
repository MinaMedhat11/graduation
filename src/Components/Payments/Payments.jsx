import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './Payments.module.css';

export default function Payments() {
  // Sample data for the user's course
  const userCourse = {
    title: 'Advanced Course In Networks'
  };
  
  // Sample data for user balance
  const userBalance = {
    amount: 0.00,
    currency: 'EGP'
  };

  return (
    <div className={styles.paymentsContainer}>
      <div className={styles.sidebarWrapper}>
        <Sidebar />
      </div>
      
      <div className={styles.mainContent}>
        <Header />
        
        <div className={styles.paymentsContent}>
          {/* Page Title */}
          <div className={styles.pageHeader}>
            <div className={styles.pageIcon}>
              <i className="fa-solid fa-wallet"></i>
            </div>
            <h1 className={styles.pageTitle}>Payments</h1>
          </div>
          
          {/* Cards Row */}
          <div className={styles.cardsRow}>
            {/* My Courses Card */}
            <div className={styles.courseCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <i className="fa-solid fa-book"></i>
                </div>
                <h3 className={styles.cardTitle}>My Courses</h3>
              </div>
              
              <div className={styles.courseContent}>
                <p className={styles.courseName}>{userCourse.title}</p>
              </div>
            </div>
            
            {/* Balance Card */}
            <div className={styles.balanceCard}>
              <h3 className={styles.balanceTitle}>Balance</h3>
              <div className={styles.balanceAmount}>
                <span className={styles.amount}>{userBalance.amount.toFixed(2)}</span>
                <span className={styles.currency}>{userBalance.currency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 