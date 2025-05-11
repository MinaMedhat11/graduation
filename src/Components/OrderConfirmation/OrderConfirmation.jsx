import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './OrderConfirmation.module.css';
// Import icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  
  // Mock order data
  const orderData = {
    orderId: '#ORD20250022',
    date: 'March 1, 2025',
    amount: '1800.00',
    currency: 'EGP',
    course: 'Advanced Course in Networks',
    payment: 'Credit Card (XXXX-XXXX-XXXX-2314)'
  };

  return (
    <div className={styles.confirmationWrapper}>
      <div className={styles.confirmationContainer}>
        <div className={styles.confirmationHeader}>
          <div className={styles.successIcon}>
            <CheckCircleOutlineIcon />
          </div>
          <h1>Payment Successful!</h1>
          <p>Your payment has been processed successfully. You now have access to your course.</p>
        </div>

        <div className={styles.orderDetails}>
          <h2>Order Details</h2>
          
          <div className={styles.detailsCard}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Order ID:</span>
              <span className={styles.detailValue}>{orderData.orderId}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Date:</span>
              <span className={styles.detailValue}>{orderData.date}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Amount:</span>
              <span className={styles.detailValue}>{orderData.amount} {orderData.currency}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Course:</span>
              <span className={styles.detailValue}>{orderData.course}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Payment Method:</span>
              <span className={styles.detailValue}>{orderData.payment}</span>
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button onClick={() => navigate('/courses')} className={styles.returnButton}>
            <ArrowBackIcon /> Return to Courses
          </button>
          <button onClick={() => navigate(`/course/123`)} className={styles.courseButton}>
            <OndemandVideoIcon /> Start Course
          </button>
          <button className={styles.receiptButton}>
            <ReceiptIcon /> Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
