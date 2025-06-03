import React, { useState, useEffect } from 'react';
import styles from '../../Payments/Payments.module.css';

// Import icons
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import Loading from 'Components/Loading/Loading';

const AdminPayments = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
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

        // Set transactions from API response
        const paymentList = result.data || [];
        setTransactions(paymentList);

        // Calculate total balance
        const total = paymentList.reduce((sum, payment) => {
          return sum + parseFloat(payment.price || 0);
        }, 0);

        setTotalBalance(total.toFixed(2));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Status icon (assuming all payments are completed based on API response)
  const getStatusIcon = () => {
    return <CheckCircleIcon className={styles.statusIconSuccess} />;
  };

  // Format date if available
  const formatDate = (date) => {
    if (!date) return 'Not available';
    return new Date(date).toLocaleDateString('en-EG');
  };

  return (
    <div className={styles.paymentsWrapper}>
      <div className={styles.titleSection}>
        <ReceiptIcon />
        <h2>Admin Payments</h2>
      </div>

      <div className={styles.balanceContainer}>
        <div className={styles.balanceInfo}>
          <p>Total Balance</p>
          <h2>
            {totalBalance} <span className={styles.currency}>EGP</span>
          </h2>
        </div>
        <button className={styles.withdrawButton}>Withdraw</button>
      </div>

      <h2 className={styles.historyTitle}>Transaction History</h2>

     if(loading) return 
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
                {getStatusIcon()}
                <div className={styles.transactionDetails}>
                  <h3>{transaction.course_name || 'N/A'}</h3>
                  <p>
                    Completed - {formatDate(transaction.payment_date)}
                  </p>
                  <div className={styles.userInfo}>
                    <PersonIcon fontSize="small" />
                    <span>{transaction.user_name || 'User'}</span>
                  </div>
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
    </div>
  );
};

export default AdminPayments;