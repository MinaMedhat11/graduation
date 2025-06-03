import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './Checkout.module.css';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [courseData, setCourseData] = useState({
    title: '',
    price: 0,
    discount: 0,
    currency: 'EGP'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    country: 'egypt',
    card_number: '',
    cvc: '',
    expiry: ''
  });
  
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        setError('No course selected');
        setLoading(false);
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/all-courses/subscribe/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const course = response.data.data;
        setCourseData({
          title: course.name,
          price: course.price,
          discount: course.discount > 0 ? (course.price * course.discount / 100) : 0,
          currency: 'EGP'
        });
        
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseData();
  }, [courseId]);
  
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod !== 'creditCard') {
      navigate('/order-confirmation');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      if (!courseId) {
        alert('Error: Course ID is missing');
        return;
      }
      
      await axios.post('http://127.0.0.1:8000/api/all-courses/complete-enrollment', {
        course_id: courseId,
        name: formData.name,
        country: formData.country,
        card_number: formData.card_number,
        cvc: formData.cvc
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      navigate('/order-confirmation');
      
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Payment failed. Please check your card details and try again.');
    }
  };
  
  if (loading) {
    return <div className={styles.loadingMessage}>Loading checkout information...</div>;
  }
  
  if (error) {
    return (
      <div className={styles.errorMessage}>
        {error}
        <Link to="/courses" className={styles.backLink}>Return to Courses</Link>
      </div>
    );
  }
  
  return (
    <div className={styles.checkoutWrapper}>
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutHeader}>
          <h1>Checkout</h1>
          <Link to="/courses" className={styles.backLink}>
            <ArrowBackIcon /> Back to Courses
          </Link>
        </div>
        <div className={styles.checkoutContent}>
          <div className={styles.orderSummary}>
            <h2>Order Summary</h2>
            <div className={styles.courseInfo}>
              <h3>{courseData.title}</h3>
              <div className={styles.priceSummary}>
                <div className={styles.priceRow}>
                  <span>Original Price:</span>
                  <span>{courseData.price.toFixed(2)} {courseData.currency}</span>
                </div>
                {courseData.discount > 0 && (
                  <div className={styles.priceRow}>
                    <span>Discount:</span>
                    <span>-{courseData.discount.toFixed(2)} {courseData.currency}</span>
                  </div>
                )}
                <div className={styles.priceRow}>
                  <span>Taxes:</span>
                  <span>0.00 {courseData.currency}</span>
                </div>
                <div className={`${styles.priceRow} ${styles.totalRow}`}>
                  <span>Total:</span>
                  <span>{(courseData.price - courseData.discount).toFixed(2)} {courseData.currency}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.paymentDetails}>
            <h2>Payment Details</h2>
            
            <div className={styles.paymentMethods}>
              <div 
                className={`${styles.paymentMethod} ${paymentMethod === 'creditCard' ? styles.selectedMethod : ''}`}
                onClick={() => handlePaymentMethodChange('creditCard')}
              >
                <CreditCardIcon />
                <span>Credit Card</span>
                {paymentMethod === 'creditCard' && <CheckCircleIcon className={styles.checkIcon} />}
              </div>
              
              <div 
                className={`${styles.paymentMethod} ${paymentMethod === 'bankTransfer' ? styles.selectedMethod : ''}`}
                onClick={() => handlePaymentMethodChange('bankTransfer')}
              >
                <AccountBalanceIcon />
                <span>Bank Transfer</span>
                {paymentMethod === 'bankTransfer' && <CheckCircleIcon className={styles.checkIcon} />}
              </div>
              
              <div 
                className={`${styles.paymentMethod} ${paymentMethod === 'fawry' ? styles.selectedMethod : ''}`}
                onClick={() => handlePaymentMethodChange('fawry')}
              >
                <PaymentIcon />
                <span>Fawry</span>
                {paymentMethod === 'fawry' && <CheckCircleIcon className={styles.checkIcon} />}
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              {paymentMethod === 'creditCard' && (
                <div className={styles.creditCardForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Cardholder Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      placeholder="Name on card" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="card_number">Card Number</label>
                    <input 
                      type="text" 
                      id="card_number" 
                      placeholder="1234 5678 9012 3456" 
                      value={formData.card_number}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="expiry">Expiry Date</label>
                      <input 
                        type="text" 
                        id="expiry" 
                        placeholder="MM/YY" 
                        value={formData.expiry}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="cvc">CVV</label>
                      <input 
                        type="text" 
                        id="cvc" 
                        placeholder="123" 
                        value={formData.cvc}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>
                </div>
              )}
              {paymentMethod === 'bankTransfer' && (
                <div className={styles.bankTransferInfo}>
                  <p>Please transfer the exact amount to the following bank account:</p>
                  <div className={styles.bankDetails}>
                    <p><strong>Bank Name:</strong> Education Bank</p>
                    <p><strong>Account Number:</strong> 123-456-7890</p>
                    <p><strong>IBAN:</strong> EG123456789012345678901234</p>
                    <p><strong>Reference:</strong> Your course name</p>
                  </div>
                  <p className={styles.noteText}>Note: Your enrollment will be confirmed once payment is verified.</p>
                </div>
              )}
              {paymentMethod === 'fawry' && (
                <div className={styles.fawryInfo}>
                  <p>To pay with Fawry:</p>
                  <ol>
                    <li>Visit any Fawry outlet or use the Fawry app</li>
                    <li>Use the reference code: <strong>94752638</strong></li>
                    <li>Complete the payment of <strong>{(courseData.price - courseData.discount).toFixed(2)} {courseData.currency}</strong></li>
                    <li>Your enrollment will be automatically confirmed once payment is processed</li>
                  </ol>
                  <p className={styles.noteText}>Please keep your payment receipt for reference.</p>
                </div>
              )}
              <div className={styles.formActions}>
                <button type="submit" className={styles.confirmButton}>
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;