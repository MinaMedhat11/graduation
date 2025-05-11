import React from 'react';
import styles from '../../Payments/Payments.module.css';
// Import icons
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';

const AdminPayments = () => {
  return (
    <div className={styles.paymentsWrapper}>
      <div className={styles.titleSection}>
        <ReceiptIcon />
        <h2>Admin Payments</h2>
      </div>

      <div className={styles.balanceContainer}>
        <div className={styles.balanceInfo}>
          <p>Total Balance</p>
          <h2>5000.00 <span className={styles.currency}>EGP</span></h2>
        </div>
        <button className={styles.withdrawButton}>Withdraw</button>
      </div>

      <h2 className={styles.historyTitle}>Transaction History</h2>

      <div className={styles.transactionsList}>
        <div className={styles.transactionItem}>
          <div className={styles.transactionLeft}>
            <CheckCircleIcon className={styles.statusIconSuccess} />
            <div className={styles.transactionDetails}>
              <h3>UI/UX Design</h3>
              <p>Completed - 2025-05-10</p>
              <div className={styles.userInfo}>
                <PersonIcon fontSize="small" />
                <span>John Doe</span>
              </div>
            </div>
          </div>
          <div className={styles.transactionRight}>
            <p className={styles.amount}>150.00 <span className={styles.currency}>EGP</span></p>
            <p className={styles.transactionId}>#12345</p>
            <button className={styles.receiptButton}>
              <ReceiptIcon /> Download Receipt
            </button>
          </div>
        </div>

        <div className={styles.transactionItem}>
          <div className={styles.transactionLeft}>
            <PendingIcon className={styles.statusIconPending} />
            <div className={styles.transactionDetails}>
              <h3>Web Development</h3>
              <p>Pending - 2025-05-09</p>
              <div className={styles.userInfo}>
                <PersonIcon fontSize="small" />
                <span>Jane Smith</span>
              </div>
            </div>
          </div>
          <div className={styles.transactionRight}>
            <p className={styles.amount}>200.00 <span className={styles.currency}>EGP</span></p>
            <p className={styles.transactionId}>#12346</p>
            <button className={styles.receiptButton}>
              <ReceiptIcon /> Download Receipt
            </button>
          </div>
        </div>

        <div className={styles.transactionItem}>
          <div className={styles.transactionLeft}>
            <CancelIcon className={styles.statusIconCancelled} />
            <div className={styles.transactionDetails}>
              <h3>AI Fundamentals</h3>
              <p>Cancelled - 2025-05-08</p>
              <div className={styles.userInfo}>
                <PersonIcon fontSize="small" />
                <span>Alex Johnson</span>
              </div>
            </div>
          </div>
          <div className={styles.transactionRight}>
            <p className={styles.amount}>175.00 <span className={styles.currency}>EGP</span></p>
            <p className={styles.transactionId}>#12347</p>
            <button className={styles.receiptButton}>
              <ReceiptIcon /> Download Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
