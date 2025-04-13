import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

// Icons
import WalletIcon from '@mui/icons-material/Wallet';
import DownloadIcon from '@mui/icons-material/Download';
import AddCardIcon from '@mui/icons-material/AddCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Paid
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; // Pending
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // Failed/Error


// Mock Data
const availableBalance = 100.00;
const currency = 'EGP';

const transactionHistory = [
  {
    id: 1,
    title: 'UI/UX Design',
    status: 'Paid',
    date: '2025-03-04',
    amount: 49.99,
    currency: 'EGP',
  },
  {
    id: 2,
    title: 'UI/UX Design',
    status: 'Pending',
    date: '2025-03-04',
    amount: 49.99,
    currency: 'EGP',
  },
   {
    id: 3,
    title: 'UI/UX Design',
    status: 'Failed', // Example of another status
    date: '2025-03-04',
    amount: 49.99,
    currency: 'EGP',
  },
   {
     id: 4,
     title: 'Flutter Course',
     status: 'Paid',
     date: '2025-02-15',
     amount: 35.00,
     currency: 'EGP',
   },
];

// Helper to get status chip props
const getStatusProps = (status) => {
  switch (status?.toLowerCase()) {
    case 'paid':
      return { color: 'success', icon: <CheckCircleOutlineIcon />, label: 'Paid' };
    case 'pending':
      return { color: 'warning', icon: <HourglassEmptyIcon />, label: 'Pending' };
    case 'failed':
      return { color: 'error', icon: <ErrorOutlineIcon />, label: 'Failed' }; // Example
    default:
      return { color: 'default', icon: null, label: status };
  }
};

export default function Payments() {

    const handleWithdraw = () => {
        console.log('Withdraw clicked');
        // Add withdraw functionality
    };

    const handleDownloadReceipt = (id) => {
        console.log('Download Receipt clicked for transaction:', id);
        // Add download functionality
    };

    const handleAddPaymentMethod = () => {
        console.log('Add Payment Method clicked');
        // Navigate or open modal
    };

     const handleReturnToCourses = () => {
         console.log('Return to Courses clicked');
         // Example navigation: navigate('/courses');
     };

  return (
    <Box sx={{ width: '100%', maxWidth: 900, margin: 'auto' }}> {/* Center content with max width */}

        <Typography variant="h5" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3, fontWeight: 'bold' }}>
             <WalletIcon sx={{ mr: 1 }} /> Payments
        </Typography>

        {/* Available Balance Card */}
        <Card sx={{ mb: 4, borderRadius: '12px', boxShadow: 3 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                     <Typography color="text.secondary" gutterBottom>
                         Available Balance
                     </Typography>
                     <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                         {availableBalance.toFixed(2)} <Typography variant="caption" sx={{ ml: 0.5 }}>{currency}</Typography>
                     </Typography>
                </Box>
                <Button variant="contained" onClick={handleWithdraw} sx={{ borderRadius: '8px' }}>
                    Withdraw
                </Button>
            </CardContent>
        </Card>

        {/* Transaction History Section */}
        <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
            Transaction History
        </Typography>

        <Stack spacing={2} sx={{ mb: 4 }}>
            {transactionHistory.map((transaction) => {
                const statusProps = getStatusProps(transaction.status);
                return (
                     <Paper key={transaction.id} elevation={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderRadius: '12px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                             <Chip
                                icon={statusProps.icon}
                                label={statusProps.label}
                                color={statusProps.color}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 2, minWidth: '90px' }} // Give chip a minimum width
                             />
                             <Box>
                                 <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{transaction.title}</Typography>
                                 <Typography variant="body2" color="text.secondary">
                                     {statusProps.label} - {transaction.date}
                                 </Typography>
                             </Box>
                         </Box>
                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
                             <Typography variant="h6" sx={{ fontWeight: 500, mr: 3 }}>
                                 {transaction.amount.toFixed(2)} <Typography variant="caption">{transaction.currency}</Typography>
                             </Typography>
                             <Button
                                 variant="outlined"
                                 startIcon={<DownloadIcon />}
                                 onClick={() => handleDownloadReceipt(transaction.id)}
                                 size="small"
                                 sx={{ color: 'text.secondary', borderColor: 'rgba(0, 0, 0, 0.23)' }}
                             >
                                 Download Receipt
                             </Button>
                         </Box>
                    </Paper>
                );
            })}
            {transactionHistory.length === 0 && (
                <Typography color="text.secondary" align="center">No transactions yet.</Typography>
            )}
        </Stack>

        <Divider sx={{ my: 3 }}/>

        {/* Action Buttons at Bottom */}
        <Stack direction="row" spacing={2} justifyContent="space-between">
            <Button
                variant="contained"
                startIcon={<AddCardIcon />}
                onClick={handleAddPaymentMethod}
                sx={{ backgroundColor: '#673ab7', '&:hover': { backgroundColor: '#5e35b1' }, borderRadius: '8px' }} // Purple color from image
            >
                Add Payment Method
            </Button>
             <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={handleReturnToCourses}
                 sx={{ backgroundColor: '#25cf9d', '&:hover': { backgroundColor: '#1da884' }, borderRadius: '8px' }} // Green color from image
             >
                 Return to Courses
             </Button>
        </Stack>
    </Box>
  );
} 