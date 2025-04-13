import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';

// Icons for Admin Stats Cards
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'; // Total Users/Students
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'; // Total Courses
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined'; // Total Earnings
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'; // Pending Tasks/Approvals
import AssignmentIcon from '@mui/icons-material/Assignment'; // Total Assignments
import QuizIcon from '@mui/icons-material/Quiz'; // Total Quizzes
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'; // New Users
import BarChartIcon from '@mui/icons-material/BarChart'; // Reports

// Placeholder Chart component
const PlaceholderChart = ({ title }) => (
  <Paper elevation={2} sx={{ p: 2, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
    <Typography variant="h6" color="textSecondary">{title} Placeholder</Typography>
  </Paper>
);

// Stat Card component
const StatCard = ({ icon, title, value, change, changeType, iconBgColor }) => (
  <Card elevation={2} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: '12px', height: '100%' }}>
    <Avatar sx={{ bgcolor: iconBgColor || 'primary.main', color: '#fff', width: 56, height: 56, mr: 2 }}>
      {icon}
    </Avatar>
    <Box>
      <Typography variant="h6" gutterBottom>
        {value}
      </Typography>
      <Typography color="textSecondary" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
       {change && (
         <Typography variant="caption" color={changeType === 'increase' ? 'success.main' : 'error.main'}>
           {changeType === 'increase' ? '▲' : '▼'} {change}
         </Typography>
       )}
    </Box>
  </Card>
);

// Mock Data for Admin Dashboard
const adminStatsData = [
    { icon: <PeopleOutlineIcon sx={{ color: '#fff' }}/>, title: 'Total Students', value: '9,689', change: '8.5% Up', changeType: 'increase', iconBgColor: '#4CAF50' },
    { icon: <SchoolOutlinedIcon sx={{ color: '#fff' }}/>, title: 'Total Courses', value: '193', change: '1.3% Up', changeType: 'increase', iconBgColor: '#FFC107' },
    { icon: <AttachMoneyOutlinedIcon sx={{ color: '#fff' }}/>, title: 'Total Earnings', value: '$10,800', change: '4.3% Down', changeType: 'decrease', iconBgColor: '#2196F3' },
    { icon: <HourglassEmptyOutlinedIcon sx={{ color: '#fff' }}/>, title: 'Pending Enrollments', value: '15', change: '1.8% Up', changeType: 'increase', iconBgColor: '#F44336' },
    { icon: <PersonAddAlt1Icon sx={{ color: '#fff' }}/>, title: 'New Users (Month)', value: '1,200', change: '5% Up', changeType: 'increase', iconBgColor: '#9C27B0' },
    { icon: <AssignmentIcon sx={{ color: '#fff' }}/>, title: 'Assignments Graded', value: '850', change: '10% Up', changeType: 'increase', iconBgColor: '#009688' },
    { icon: <QuizIcon sx={{ color: '#fff' }}/>, title: 'Quizzes Taken', value: '2,100', change: '7% Up', changeType: 'increase', iconBgColor: '#795548' },
    { icon: <BarChartIcon sx={{ color: '#fff' }}/>, title: 'Reports Generated', value: '25', change: '2% Up', changeType: 'increase', iconBgColor: '#607D8B' },
];

export default function AdminDashboard() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Admin Dashboard Overview
      </Typography>
      <Grid container spacing={3}>

        {/* Statistics Cards */}
        {adminStatsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard 
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              iconBgColor={stat.iconBgColor}
            />
          </Grid>
        ))}

        {/* Charts Row */}
        <Grid item xs={12} md={8}>
          <PlaceholderChart title="Revenue Over Time" />
        </Grid>
        <Grid item xs={12} md={4}>
           <PlaceholderChart title="User Signups" />
        </Grid>

        {/* Other Potential Admin Sections (Placeholders) */}
        <Grid item xs={12} md={6}>
             <Paper elevation={2} sx={{ p: 2, borderRadius: '12px'}}>
                 <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                 <Typography variant="body2" color="textSecondary">Admin activity feed placeholder...</Typography>
                 {/* Add List or Table here */}
             </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
             <Paper elevation={2} sx={{ p: 2, borderRadius: '12px'}}>
                 <Typography variant="h6" gutterBottom>System Health</Typography>
                 <Typography variant="body2" color="textSecondary">Server status, DB connections, etc. placeholder...</Typography>
                 {/* Add status indicators here */}
             </Paper>
        </Grid>

      </Grid>
    </Box>
  );
} 