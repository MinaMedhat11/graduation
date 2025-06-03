import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './OrderConfirmation.module.css';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  
  // Set initial order data with fallback values
  const orderId = `#ORD${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const [orderData, setOrderData] = useState({
    orderId: orderId,
    date: currentDate,
    amount: '0.00',
    currency: 'EGP',
    course: 'Course Name',
    payment: 'Credit Card'
  });
  
  // Get course ID from session storage as a fallback
  const courseIdFromStorage = sessionStorage.getItem('lastPurchasedCourseId');
  // Try to get courseId from location state first, then from session storage
  const courseId = location.state?.courseId || courseIdFromStorage;
  
  useEffect(() => {
    // Store courseId in session storage for page refreshes
    if (location.state?.courseId) {
      sessionStorage.setItem('lastPurchasedCourseId', location.state.courseId);
    }
    
    // Get payment method from location state
    if (location.state?.paymentMethod) {
      setOrderData(prev => ({
        ...prev,
        payment: location.state.paymentMethod
      }));
    }
    
    const fetchCourseData = async () => {
      try {
        // Try both endpoints to get course data
        const token = localStorage.getItem('token');
        console.log("Fetching course ID:", courseId);
        
        // Method 1: Try getting from all-courses first
        const allCoursesResponse = await axios.get('http://127.0.0.1:8000/api/all-courses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Look for our course in both allCourses and myCourses
        const allCourses = allCoursesResponse.data.data.allCourses.data;
        const myCourses = allCoursesResponse.data.data.myCourses.data;
        
        // Find the course with the matching ID
        let targetCourse = null;
        if (courseId) {
          // Search in myCourses first, then allCourses
          targetCourse = myCourses.find(c => c.id === parseInt(courseId)) || 
                        allCourses.find(c => c.id === parseInt(courseId));
        } else {
          // If no course ID, just get the first course in myCourses
          targetCourse = myCourses[0];
        }
        
        if (targetCourse) {
          console.log("Found course:", targetCourse);
          
          // Calculate the actual price with discount
          const actualPrice = targetCourse.discount > 0 
            ? (targetCourse.price - (targetCourse.price * targetCourse.discount / 100)).toFixed(2)
            : targetCourse.price.toFixed(2);
          
          // Update order data with the course info
          setOrderData(prev => ({
            ...prev,
            course: targetCourse.name,
            amount: actualPrice
          }));
          
          // Store the course ID in state
          if (targetCourse.id) {
            sessionStorage.setItem('lastPurchasedCourseId', targetCourse.id);
          }
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseData();
  }, [location.state, courseId]);
  
  if (loading) {
    return <div className={styles.loading}>Loading your confirmation...</div>;
  }
  
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
          <button 
            onClick={() => navigate(`/course/${courseId}`)} 
            className={styles.courseButton}
          >
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