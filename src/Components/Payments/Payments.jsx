import React, { useState, useEffect } from 'react';
import styles from './Payments.module.css';

// Import icons
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/api/all-payment', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const result = await response.json();
        
        if (!result.status) {
          throw new Error(result.message || 'Failed to fetch payments');
        }

        // Assuming all transactions are active, update based on actual API needs
        setTransactions(result.data || []);
        
        // Calculate available balance (adjust logic based on actual business rules)
        const balance = result.data.reduce((sum, transaction) => {
          if (transaction.payment_date) { // Assuming payment_date indicates paid
            return sum + parseFloat(transaction.price || 0);
          }
          return sum;
        }, 0);
        
        setAvailableBalance(balance.toFixed(2));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Status icon based on payment_date
  const getStatusIcon = (paymentDate) => {
    if (paymentDate) {
      return <CheckCircleIcon className={styles.statusIconSuccess} />;
    }
    return <PendingIcon className={styles.statusIconPending} />;
  };

  // Format date if available
  const formatDate = (date) => {
    if (!date) return 'Pending';
    return new Date(date).toLocaleDateString('en-EG');
  };

  return (
    <div className={styles.paymentsWrapper}>
      <div className={styles.titleSection}>
        <ReceiptIcon />
        <h2>Payments</h2>
      </div>
      
      <div className={styles.balanceContainer}>
        <div className={styles.balanceInfo}>
          <p>Available Balance</p>
          <h2>
            {availableBalance} <span className={styles.currency}>EGP</span>
          </h2>
        </div>
        <button className={styles.withdrawButton}>Withdraw</button>
      </div>
      
      <h2 className={styles.historyTitle}>Transaction History</h2>
      
      {loading && <p className={styles.loading}>Loading transactions...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}
      
      {!loading && transactions.length === 0 && (
        <p className={styles.noTransactions}>No transactions found.</p>
      )}
      
      <div className={styles.transactionsList}>
        {!loading &&
          transactions.length > 0 &&
          transactions.map((transaction, index) => (
            <div key={index} className={styles.transactionItem}>
              <div className={styles.transactionLeft}>
                {getStatusIcon(transaction.payment_date)}
                <div className={styles.transactionDetails}>
                  <h3>{transaction.course_name || 'N/A'}</h3>
                  <p>
                    {transaction.payment_date ? 'Paid' : 'Pending'} -{' '}
                    {formatDate(transaction.payment_date)}
                  </p>
                </div>
              </div>
              <div className={styles.transactionRight}>
                <p className={styles.amount}>
                  {transaction.price?.toFixed(2) || '0.00'}{' '}
                  <span className={styles.currency}>EGP</span>
                </p>
                <button className={styles.receiptButton}>
                  <ReceiptIcon /> Download Receipt
                </button>
              </div>
            </div>
          ))}
      </div>
      
      <div className={styles.actionButtons}>
        <button className={styles.addPaymentButton}>
          <ReceiptIcon /> Add Payment Method
        </button>
        <button className={styles.returnButton}>
          <ArrowBackIcon /> Return to Courses
        </button>
      </div>
    </div>
  );
};

export default Payments;